# Knowledge Graph System
## System Design Document (v1)

## 1. Overview

### 1.1 Purpose
This system aims to provide a personal knowledge management platform that transforms unstructured data (e.g., documents, notes) into a structured and queryable knowledge representation. The system integrates:

- Semantic retrieval via vector search
- Explicit relational modeling via a knowledge graph
- Machine learning and deep learning pipelines
- Large Language Models (LLMs)
- Agent-based reasoning components

### 1.2 Objectives

- Enable semantic understanding and retrieval of documents
- Represent knowledge as a graph of interconnected concepts
- Support Retrieval-Augmented Generation (RAG)
- Provide interactive graph-based visualization
- Serve as a practical platform for learning:
  - Distributed systems
  - Machine learning and deep learning workflows
  - LLM orchestration

---

## 2. System Architecture

### 2.1 Architectural Style

- Microservices architecture
- gRPC for internal service-to-service communication
- REST API for frontend communication
- Event-driven architecture for asynchronous processing

### 2.2 Core Components

#### 2.2.1 Frontend
- React-based user interface

Responsibilities:
- Graph visualization
- Document management
- Search and conversational interface

---

#### 2.2.2 API Gateway (Main Backend)
- Implemented using ASP.NET Core

Responsibilities:
- Authentication and authorization
- Request routing and orchestration
- Aggregation of downstream service responses
- Rate limiting and caching

---

#### 2.2.3 Identity Service

Responsibilities:
- User management
- Role and permission management

Storage:
- MSSQL Server

---

#### 2.2.4 Document Service

Responsibilities:
- Document metadata management
- Upload lifecycle handling

Integration:
- Object storage for raw files

---

#### 2.2.5 Ingestion Pipeline

Transforms raw documents into structured knowledge representations.

Pipeline stages:
1. Upload to object storage
2. Document parsing (PDF, Markdown, HTML)
3. Text chunking
4. Embedding generation
5. Persistence:
   - Vector database (embeddings)
   - Graph database (concepts and relations)

---

#### 2.2.6 Vector Search Service

Responsibilities:
- Embedding storage
- Similarity search
- Optional hybrid retrieval (keyword + vector)

---

#### 2.2.7 Knowledge Graph Service

Responsibilities:
- Management of concept nodes
- Management of relationships (edges)
- Linking documents to graph entities

---

#### 2.2.8 ML / LLM Service (Python)

Subcomponents:
- Embedding generation service
- RAG orchestration layer
- Model experimentation and evaluation

---

#### 2.2.9 Background Workers

Responsibilities:
- Asynchronous ingestion processing
- Embedding computation
- Graph updates
- Model training and batch jobs

---

#### 2.2.10 Messaging Infrastructure

Purpose:
- Enable decoupled and asynchronous communication between services

Technology:
- RabbitMQ (initial choice)

---

## 3. Data Storage Strategy

### 3.1 Relational Database (MSSQL)

Stores:
- Users
- Roles and permissions
- Document metadata

---

### 3.2 Vector Database

Stores:
- Dense vector embeddings

Supports:
- Efficient similarity search

---

### 3.3 Graph Database

Stores:
- Concepts (nodes)
- Relationships (edges)
- Document-to-concept mappings

---

### 3.4 Object Storage

Stores:
- Raw documents (e.g., PDFs, notes)

---

## 4. Machine Learning Integration

### 4.1 Use Cases

#### 4.1.1 Topic Extraction
- Input: document
- Output: concepts or tags

Methods:
- Transformer-based models
- Clustering techniques

---

#### 4.1.2 Relation Extraction

Identifies:
- Hierarchical relationships
- Semantic dependencies
- Concept associations

Output:
- Structured relationships stored in the graph database

---

#### 4.1.3 Recommendation System

Provides:
- Related documents
- Suggested topics

Based on:
- Graph proximity
- Embedding similarity
- User interaction data

---

#### 4.1.4 Retrieval-Augmented Generation (RAG)

Pipeline:
1. Retrieval (vector database)
2. Re-ranking
3. Generation (LLM)

---

#### 4.1.5 Knowledge Modeling (Future Work)

- Tracks user interaction patterns
- Identifies knowledge gaps

---

## 5. Agent-Based Components

### 5.1 Retrieval Agent

Selects retrieval strategy:
- Vector search
- Graph traversal
- Keyword search

---

### 5.2 Research Agent

- Aggregates relevant knowledge for a given topic
- Produces structured outputs

---

### 5.3 Ingestion Agent

- Enhances parsing
- Suggests relationships during ingestion

---

## 6. Communication Layer

### 6.1 gRPC
Used for internal service-to-service communication.

### 6.2 REST API
Used for frontend-to-backend communication.

---

## 7. Supporting Infrastructure

### 7.1 Caching
- Redis

Use cases:
- Query caching
- Session storage

---

### 7.2 Observability

- Logging
- Metrics
- Distributed tracing

---

## 8. Development Roadmap

### Phase 1 (MVP)
- Document upload
- Basic ingestion pipeline
- Vector search
- Minimal UI

### Phase 2
- Graph database integration
- RAG pipeline
- Graph visualization

### Phase 3
- ML enhancements (tagging, relation extraction)
- Recommendation system
- Background workers

### Phase 4
- Agent-based components
- Personalization
- System optimization

---

## 9. Design Principles

- Clear separation of concerns
- Well-defined service boundaries
- Asynchronous handling of compute-intensive tasks
- Explicit distinction between:
  - Graph-based knowledge representation
  - Vector-based semantic similarity
- Prioritize learning and clarity over premature optimization

---

## 10. Guiding Concept

The system transforms unstructured data into a structured, navigable knowledge graph augmented by semantic retrieval and generative reasoning.