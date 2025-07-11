const { Pool } = require('@neondatabase/serverless');
const { drizzle } = require('drizzle-orm/neon-serverless');
const { lessons } = require('../shared/schema');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool });

const initialLessons = [
  { level: "Iniciante", englishText: "The book is on the table.", portugueseText: "O livro está sobre a mesa." },
  { level: "Intermediário", englishText: "Software architecture is the set of fundamental structures of a software system.", portugueseText: "Arquitetura de software é o conjunto de estruturas fundamentais de um sistema de software." },
  { level: "Intermediário", englishText: "To be a good software architect, you need to understand the business requirements deeply.", portugueseText: "Para ser um bom arquiteto de software, você precisa entender profundamente os requisitos de negócio." },
  { level: "Avançado", englishText: "Leveraging CQRS and event sourcing can lead to highly scalable and resilient systems, but it introduces complexity.", portugueseText: "Aproveitar CQRS e event sourcing pode levar a sistemas altamente escaláveis e resilientes, mas introduz complexidade." },
  { level: "Iniciante", englishText: "I would like to order a coffee, please.", portugueseText: "Eu gostaria de pedir um café, por favor." },
  { level: "Iniciante", englishText: "Where is the nearest train station?", portugueseText: "Onde é a estação de trem mais próxima?" },
  { level: "Intermediário", englishText: "The team is deploying the new feature to the production environment.", portugueseText: "A equipe está implantando o novo recurso no ambiente de produção." },
  { level: "Intermediário", englishText: "Learning a new language opens up a world of opportunities.", portugueseText: "Aprender um novo idioma abre um mundo de oportunidades." },
  { level: "Avançado", englishText: "A robust CI/CD pipeline is crucial for modern software development agility.", portugueseText: "Um pipeline de CI/CD robusto é crucial para a agilidade do desenvolvimento de software moderno." },
  { level: "Avançado", englishText: "Despite the initial challenges, refactoring the legacy code resulted in significant performance improvements.", portugueseText: "Apesar dos desafios iniciais, a refatoração do código legado resultou em melhorias significativas de desempenho." },
  { level: "Iniciante", englishText: "My name is Carlos.", portugueseText: "Meu nome é Carlos." },
  { level: "Iniciante", englishText: "What time is it?", portugueseText: "Que horas são?" },
  { level: "Iniciante", englishText: "I need help with my luggage.", portugueseText: "Eu preciso de ajuda com minha bagagem." },
  { level: "Iniciante", englishText: "How much does this cost?", portugueseText: "Quanto custa isto?" },
  { level: "Iniciante", englishText: "The weather is beautiful today.", portugueseText: "O tempo está lindo hoje." },
  { level: "Iniciante", englishText: "Can you speak slowly, please?", portugueseText: "Você pode falar devagar, por favor?" },
  { level: "Iniciante", englishText: "I am learning English.", portugueseText: "Eu estou aprendendo inglês." },
  { level: "Iniciante", englishText: "This is my family.", portugueseText: "Esta é minha família." },
  { level: "Iniciante", englishText: "See you tomorrow.", portugueseText: "Até amanhã." },
  { level: "Iniciante", englishText: "Have a nice day!", portugueseText: "Tenha um bom dia!" },
  { level: "Intermediário", englishText: "The database migration script failed last night.", portugueseText: "O script de migração do banco de dados falhou na noite passada." },
  { level: "Intermediário", englishText: "We need to optimize the query to improve performance.", portugueseText: "Nós precisamos otimizar a consulta para melhorar o desempenho." },
  { level: "Intermediário", englishText: "What are the main advantages of using this framework?", portugueseText: "Quais são as principais vantagens de usar este framework?" },
  { level: "Intermediário", englishText: "The project deadline is approaching quickly.", portugueseText: "O prazo do projeto está se aproximando rapidamente." },
  { level: "Intermediário", englishText: "I have been working as a software architect for ten years.", portugueseText: "Eu trabalho como arquiteto de software há dez anos." },
  { level: "Intermediário", englishText: "Could you please review my pull request?", portugueseText: "Você poderia, por favor, revisar meu pull request?" },
  { level: "Intermediário", englishText: "Effective communication is key to a successful team.", portugueseText: "Comunicação eficaz é a chave para uma equipe de sucesso." },
  { level: "Intermediário", englishText: "Let's schedule a meeting to discuss the requirements.", portugueseText: "Vamos agendar uma reunião para discutir os requisitos." },
  { level: "Intermediário", englishText: "The application is not responding.", portugueseText: "A aplicação não está respondendo." },
  { level: "Intermediário", englishText: "I'm looking forward to our trip to the beach.", portugueseText: "Estou ansioso para nossa viagem à praia." },
  { level: "Avançado", englishText: "Idempotency is a critical property for handlers in a distributed event-driven architecture.", portugueseText: "A idempotência é uma propriedade crítica para handlers em uma arquitetura distribuída orientada a eventos." },
  { level: "Avançado", englishText: "The CAP theorem forces a choice between consistency and availability during a network partition.", portugueseText: "O teorema CAP força uma escolha entre consistência e disponibilidade durante uma partição de rede." },
  { level: "Avançado", englishText: "Implementing a circuit breaker pattern can prevent cascading failures in microservices.", portugueseText: "Implementar um padrão de circuit breaker pode prevenir falhas em cascata em microsserviços." },
  { level: "Avançado", englishText: "The nuances of garbage collection in high-performance applications cannot be overstated.", portugueseText: "As nuances da coleta de lixo em aplicações de alto desempenho não podem ser exageradas." },
  { level: "Avançado", englishText: "He had to delve into the intricacies of the legacy system to debug the elusive issue.", portugueseText: "Ele teve que mergulhar nas complexidades do sistema legado para depurar o problema elusivo." },
  { level: "Avançado", englishText: "The proliferation of IoT devices presents both opportunities and significant security challenges.", portugueseText: "A proliferação de dispositivos IoT apresenta tanto oportunidades quanto desafios de segurança significativos." },
  { level: "Avançado", englishText: "Quantum computing threatens to render current cryptographic standards obsolete.", portugueseText: "A computação quântica ameaça tornar os padrões criptográficos atuais obsoletos." },
  { level: "Avançado", englishText: "The committee's decision was predicated on a thorough analysis of the economic data.", portugueseText: "A decisão do comitê foi baseada em uma análise completa dos dados econômicos." },
  { level: "Avançado", englishText: "They reached an impasse in the negotiations, with neither side willing to compromise.", portugueseText: "Eles chegaram a um impasse nas negociações, com nenhum dos lados disposto a ceder." },
  { level: "Avançado", englishText: "To remain competitive, the company must perpetually innovate.", portugueseText: "Para se manter competitiva, a empresa deve inovar perpetuamente." },
  { level: "Iniciante", englishText: "The sky is blue.", portugueseText: "O céu é azul." },
  { level: "Intermediário", englishText: "I'm reading a book about artificial intelligence.", portugueseText: "Estou lendo um livro sobre inteligência artificial." },
  { level: "Avançado", englishText: "The philosophical implications of sentient AI are profound.", portugueseText: "As implicações filosóficas de uma IA senciente são profundas." },
  { level: "Iniciante", englishText: "My favorite food is pizza.", portugueseText: "Minha comida favorita é pizza." },
  { level: "Intermediário", englishText: "We should refactor this component to make it more reusable.", portugueseText: "Deveríamos refatorar este componente para torná-lo mais reutilizável." },
  { level: "Avançado", englishText: "The system exhibits emergent behavior that was not explicitly programmed.", portugueseText: "O sistema exibe um comportamento emergente que não foi explicitamente programado." },
  { level: "Iniciante", englishText: "I go to the gym three times a week.", portugueseText: "Eu vou à academia três vezes por semana." },
  { level: "Intermediário", englishText: "The API documentation is unclear about this endpoint.", portugueseText: "A documentação da API não é clara sobre este endpoint." },
  { level: "Avançado", englishText: "Orthogonality in software design reduces coupling and improves maintainability.", portugueseText: "A ortogonalidade no design de software reduz o acoplamento e melhora a manutenibilidade." },
  { level: "Intermediário", englishText: "I'm trying to connect to the database, but I'm getting an error.", portugueseText: "Estou tentando me conectar ao banco de dados, mas estou recebendo um erro." }
];

async function seedDatabase() {
  try {
    console.log('Seeding database with initial lessons...');
    
    // Check if lessons already exist
    const existingLessons = await db.select().from(lessons).limit(1);
    if (existingLessons.length > 0) {
      console.log('Database already seeded. Skipping...');
      return;
    }
    
    // Insert all lessons
    await db.insert(lessons).values(initialLessons);
    console.log(`Successfully seeded ${initialLessons.length} lessons to the database!`);
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

seedDatabase();