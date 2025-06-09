from langchain_community.document_loaders import DirectoryLoader, UnstructuredMarkdownLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import HuggingFaceEmbeddings
from langchain_chroma.vectorstores import Chroma
from langchain_community.embeddings.huggingface import HuggingFaceEmbeddings

def load_documents():
    loader = DirectoryLoader(
        path="docs",
        glob="**/*.md",
        loader_cls=UnstructuredMarkdownLoader
    )
    return loader.load()

def split_documents(documents):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50
    )
    return splitter.split_documents(documents)

def create_vectorstore(splits):
    embedding = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    vectordb = Chroma.from_documents(
        documents=splits,
        embedding=embedding,
        persist_directory="vectorstore"
    )
    print("Vectorstore created and saved to disk!")
    return vectordb

if __name__ == "__main__":
    print("📥 Loading documents...")
    documents = load_documents()

    print("✂️ Splitting documents...")
    splits = split_documents(documents)

    print("🧠 Creating vectorstore...")
    vectordb = create_vectorstore(splits)
