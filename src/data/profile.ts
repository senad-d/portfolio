export interface ProfileLink {
  label: string;
  url: string;
}

export const profile = {
  name: 'Senad Dizdarević',
  alternateName: 'Senad Dizdarevic',
  jobTitle: 'DevOps & Cloud Engineer',
  headline: 'AWS-certified DevOps and cloud engineer',
  summary:
    'AWS-certified DevOps and cloud engineer focused on secure automation, reliable delivery pipelines, and measurable cloud outcomes.',
  about:
    'Works in two delivery modes: embedded partner for hiring teams and focused consultant for freelance clients. In both cases the goal is the same: simple architecture first, reliable automation, strong security posture, and clear operational ownership after handover.',
  email: 'senad.dizdarevic.ri@gmail.com',
  links: [
    { label: 'GitHub', url: 'https://github.com/senad-d' },
    {
      label: 'LinkedIn',
      url: 'https://www.linkedin.com/in/senad-dizdarevic-devops',
    },
    {
      label: 'Upwork',
      url: 'https://www.upwork.com/freelancers/~017a10028c45b2150f',
    },
    { label: 'YouTube', url: 'https://www.youtube.com/@senaddizdarevic7849' },
  ] as ProfileLink[],
};

export const skillGroups = [
  {
    title: 'AWS Platform Delivery',
    items: [
      'AWS Organisations',
      'AWS SecurityHub',
      'AWS Config',
      'IAM',
      'VPC',
      'AWS TransitGateway',
      'LoadBalancer',
      'CloudMap',
      'EC2',
      'ECS',
      'EKS',
      'Lambda',
      'API Gateway',
      'RDS',
      'DynamoDB',
      'S3',
      'ECR',
      'ElastiCache',
      'CodeArtifact',
      'CloudFront',
      'Route 53',
      'Cognito',
      'WAF',
      'SES',
      'SNS',
      'SQS',
      'SecurityHub',
      'ParameterStore',
      'CodeConnect',
    ],
  },
  {
    title: 'Tools & Automation',
    items: [
      'Terraform',
      'CloudFormation',
      'GitHub Actions',
      'CodePipeline',
      'Jenkins',
      'Git',
      'Docker',
      'OpenID',
      'Keycloak',
      'OpenVPN',
    ],
  },
  {
    title: 'Frameworks and Languages Used Across Projects',
    items: [
      'Spring Boot',
      'Golang',
      'Java',
      'Node.js',
      'React',
      'Angular',
      'TypeScript',
      'JavaScript',
      '.NET',
      'Python',
      'Bash',
    ],
  },
  {
    title: 'Observability & Security',
    items: [
      'CloudWatch',
      'Grafana',
      'Loki',
      'Prometheus',
      'Tempo',
      'OpenTelemetry',
      'Trivy',
      'OWASP Dependency-Check',
      'Security Hub',
      'AWS Config',
    ],
  },
  {
    title: 'LLM Tooling',
    items: [
      'Microsoft Foundry',
      'AWS Bedrock',
      'Claud',
      'Codex',
      'Pi',
      'LiteLLM',
      'Ollama',
      'LM Studio',
    ],
  },
];

export const experienceTimeline = [
  {
    role: 'DevOps Engineer — Principal Technology CSE',
    company: 'Valcon (full-time)',
    period: 'Jan 2026 — Present',
    highlights: [
      'Focus: Amazon Web Services (AWS), Terraform, and platform engineering.',
      'Lead enterprise cloud delivery with secure and scalable infrastructure patterns.',
    ],
  },
  {
    role: 'DevOps Engineer',
    company: 'Upwork (freelance)',
    period: 'Feb 2025 — Present',
    highlights: [
      'Focus: Amazon Web Services (AWS) and Terraform.',
      'Design and operate production-ready AWS environments for freelance clients.',
    ],
  },
  {
    role: 'DevOps Engineer — Senior Specialist',
    company: 'Valcon (full-time)',
    period: 'Jul 2024 — Jan 2026',
    highlights: [
      'Focus: Amazon Web Services (AWS) and Terraform.',
      'Scaled reusable IaC and deployment workflows across client engagements.',
    ],
  },
  {
    role: 'DevOps Technology Specialist',
    company: 'Valcon (full-time)',
    period: 'Jan 2023 — Jul 2024',
    highlights: [
      'Focus: infrastructure and Linux.',
      'Supported stable operations and core infrastructure improvements.',
    ],
  },
  {
    role: 'DevOps Engineer',
    company: 'Valcon (full-time)',
    period: 'Sep 2022 — Jan 2023',
    highlights: [
      'Focus: infrastructure, Git, and DevOps tooling.',
      'Built foundational delivery workflows for cloud platform work.',
    ],
  },
  {
    role: 'Technical Support Manager',
    company: 'INA Grupa (full-time)',
    period: 'Jan 2011 — Nov 2022',
    highlights: [
      'Led long-term on-site production support operations.',
      'Built incident communication and coordination discipline applied in later DevOps delivery.',
    ],
  },
];

export const certifications: Array<{
  title: string;
  issuer: string;
  issued: string;
  credentialId: string;
  credentialUrl?: string;
}> = [
  {
    title: 'AWS Certified Solutions Architect — Associate',
    issuer: 'Amazon Web Services',
    issued: 'Jan 2023',
    credentialId: '9FRV6K8KYBVEQG92',
    credentialUrl:
      'https://www.certmetrics.com/amazon/public/verification.aspx?code=9FRV6K8KYBVEQG92&lang=en',
  },
];

export const coreTools = ['AWS', 'Terraform', 'Docker', 'Git', 'Pi'];
