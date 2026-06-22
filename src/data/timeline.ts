export interface TimelineEntry {
  year: string;
  title: string;
  description: string;
  images: string[];
}

export const timeline: TimelineEntry[] = [
  {
    year: '2020',
    title: 'Into IIT Guwahati',
    description: 'Got into IIT Guwahati. Chose Mechanical Engineering.',
    images: [],
  },
  {
    year: '2021',
    title: 'First builds',
    description:
      'Built Yuvaan, IITG\'s Mars Rover, and Marjanator, a water garbage collector for the Brahmaputra.',
    images: [],
  },
  {
    year: '2022',
    title: 'Leading robotics',
    description:
      'Became Secretary of the Robotics Club. Took over as Yuvaan\'s team lead.',
    images: [],
  },
  {
    year: '2023',
    title: 'Bengaluru, and a new job',
    description:
      'Took Yuvaan to Bengaluru for the International Rover Challenge. Joined SiriusAI, a startup building generative AI tools for the financial sector.',
    images: [],
  },
  {
    year: '2024',
    title: 'Shipping AI in production',
    description:
      'Built an LLM pipeline for invoice validation, cutting processing time from hours to minutes. Built an ESG benchmarking platform to compare corporate sustainability performance.',
    images: [],
  },
  {
    year: '2025',
    title: 'Robots, then a turn',
    description:
      'Left my job to build a robotics startup. Worked on tethered drones and teleoperated arms. Realized I wanted to build something more fundamental. Started reading economics, policy, and governance. Started The Civic Architect publication on Substack.',
    images: [],
  },
  {
    year: '2026',
    title: 'Celestiq Lattice',
    description:
      'Started building Lattice, an open-source protocol for sovereign, federated communication between people, devices, and AI agents. Currently in active development.',
    images: [],
  },
];
