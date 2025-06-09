from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain.output_parsers import StructuredOutputParser, ResponseSchema
from langchain.chains import LLMChain, SimpleSequentialChain
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_chroma.vectorstores import Chroma
import os
import json

schemas = [
    ResponseSchema(
        name="shelf_life_score",
        description=(
            "Score from 0 to 100 reflecting how well the conditions during farming and storage "
            "support long shelf life (resistance to spoilage, sprouting, rot)."
        )
    ),
    ResponseSchema(
        name="freshness_score",
        description=(
            "Score from 0 to 100 representing the perceived freshness of the potato, influenced by "
            "moisture levels, nutrient retention, and environmental stress."
        )
    ),
    ResponseSchema(
        name="skin_quality_score",
        description=(
            "Score from 0 to 100 assessing the integrity and appearance of the potato skin, "
            "affected by nutrient balance, pH, and physical damage risks."
        )
    ),
    ResponseSchema(
        name="sweetness_score",
        description=(
            "Score from 0 to 100 indicating the level of sweetness or desirable flavor development, "
            "influenced by temperature and carbohydrate metabolism during growth and curing."
        )
    ),
    ResponseSchema(
        name="texture_score",
        description=(
            "Score from 0 to 100 measuring the internal texture of the potato — firmness, mealiness, "
            "or smoothness, depending on moisture, temperature, and nutrient balance."
        )
    ),
    ResponseSchema(
        name="appearance_score",
        description=(
            "Score from 0 to 100 evaluating the visual quality of the potato, including shape, color, "
            "and absence of blemishes or deformities."
        )
    ),
    ResponseSchema(
        name="nutritional_value_score",
        description=(
            "Score from 0 to 100 representing the retention of nutritional components such as vitamins, "
            "minerals, and antioxidants."
        )
    ),
    ResponseSchema(
        name="overall_score",
        description=(
            "Final average score from 0 to 100 summarizing all other individual quality traits. "
            "Should be the arithmetic mean of all the component scores."
        )
    )
]

parser = StructuredOutputParser.from_response_schemas(schemas)
output_format_instructions = parser.get_format_instructions()

template = """
You are an agronomy and food quality expert assisting a buyer who is evaluating crops for potential purchase.

Below are the ideal growing conditions retrieved from our agronomic knowledge base, and the observed data for the crop during pre-harvest and storage phase:

Ideal Conditions (per parameter):  
{context}

Observed Conditions:  
{observed_json}

Based on the scoring system framework & the scoring rules:
{scoring_framework}

Evaluate and compute a numeric score ranging from (0-100) for each charactheristics below

Return your response as valid JSON using the following format instructions:  
{output_format_instructions}
"""

prompt = PromptTemplate(
    template=template,
    input_variables=["context", "observed_json", "scoring_framework", "output_format_instructions"],
)

embedding = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
vectordb = Chroma(persist_directory="vectorstore", embedding_function=embedding)
retriever = vectordb.as_retriever(search_kwargs={"k": 6})

google_api_key=os.environ.get("GEMINI_API_KEY")
llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",
    temperature=0.2,
    google_api_key=google_api_key
)
def analyze_crop(observed: dict):
    # retrieve relevant docs
    docs = retriever.get_relevant_documents("Potato Quality Assessment")
    # assemble the “context” block
    context = "\n".join(d.page_content for d in docs)
    docs_1= retriever.get_relevant_documents("Scoring Framework & Rules")
    context_1 = "\n".join(d.page_content for d in docs_1)
    
    # run the chain
    chain = LLMChain(
        llm=llm,
        prompt=prompt,
    )
    result = chain.run({
        "context": context,
        "observed_json": json.dumps(observed, indent=2),
        "scoring_framework": context_1,
        "output_format_instructions": output_format_instructions
    })
    return parser.parse(result)

pipeline = SimpleSequentialChain(
    chains=[], 
    verbose=True,
)

# Example driver:
# input_data = {
#     "preharvest": {
#         "air_humidity": 68,
#         "air_temperature": 16,
#         "soil_moisture": 65,
#         "soil_ph": 6.0,
#         "N": 40,     # example values, adjust based on real units
#         "P": 30,
#         "K": 80
#     },
#     "storage": {
#         "storage_temperature": 5,
#         "storage_humidity": 92,
#         "ventilation": "moderate",  # example qualitative metric
#         "light_exposure": "low",    # optional
#         "storage_duration": 90
#     }
# }

