from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_chroma.vectorstores import Chroma
from langchain.chains import LLMChain
import os
import json

template = """
You are an expert assistant helping buyers/consumers understand and evaluate the quality, freshness, and risks associated with potato crops based on farming and storage metrics.

Below are the provided metrics related to the potato crop during farming and storage. 
Use them as your primary basis for evaluation with the ideal growing condition of potato crops retrieved from our knowledge base.

Input Metrics:
{crop_metrics}

Ideal Condition:
{context}

The FAQ:
{faq}

The user has asked the following question:
{user_question}

## Your Task:
1. Analyze the `crop_metrics` and determine if they fall within ideal or problematic ranges.
2. Answer the user's question clearly and concisely using retrieved potato knowledge and metrics. 
3. Refer to the FAQ also if there is similar content relevant to it.
4. If relevant, give practical advice or next steps.

Make your answer conversational and easy to understand. 
Hinders out the information that is not useful for the user. 
Keep the response easy.
Your analyze shouldn't be show to the user as the user only want the result instead of how you analyze it
"""

embedding = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
vectordb = Chroma(persist_directory="vectorstore", embedding_function=embedding)
retriever = vectordb.as_retriever(search_kwargs={"k": 6})

google_api_key = os.environ.get("GEMINI_API_KEY")
llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",
    temperature=0.2,
    google_api_key=google_api_key,
    max_tokens=1048
)

prompt = PromptTemplate(
    template=template,
    input_variables=["crop_metrics", "context", "faq", "user_question"],
)

def load_chain(crop_metrics: dict, user_question: str):
    # Retrieve knowledge context
    context_docs = retriever.invoke(user_question)
    user_context = "\n".join(d.page_content for d in context_docs)

    # Retrieve FAQ context
    faq_docs = retriever.invoke("FAQ about potato quality, storage, and consumer questions")
    faq = "\n".join(d.page_content for d in faq_docs)
    
    # Retrieve potato quality assessment docs
    docs = retriever.invoke("Potato Quality Assessment")
    assessment_context = "\n".join(d.page_content for d in docs)
    
    # Combine contexts
    context = f"{user_context}\n\n{assessment_context}"

    # Format crop_metrics into a pretty JSON string
    crop_metrics_str = json.dumps(crop_metrics, indent=2)

    # Build the chain using LLMChain
    chatbot_chain = LLMChain(
        llm=llm,
        prompt=prompt,
        verbose=True
    )

    # Run the chatbot with the prompt inputs
    result = chatbot_chain.run(
        crop_metrics=crop_metrics_str,
        context=context,
        faq=faq,
        user_question=user_question
    )
    
    return result