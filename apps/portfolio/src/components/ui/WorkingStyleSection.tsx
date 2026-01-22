import React from 'react';
import { InteractiveCard } from './InteractiveCard';
import { Users, Zap, Message } from '@mynaui/icons-react';

const workingStyle = [
  {
    title: 'Collaborative Architect',
    subtitle: 'Teamwork & Communication',
    description: 'I believe the best code comes from diverse perspectives. I prioritize clear documentation and constructive code reviews to elevate the whole team.',
    icon: Users,
    color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20'
  },
  {
    title: 'Pragmatic Problem Solver',
    subtitle: 'Strategy & Execution',
    description: 'I focus on shipping value. I balance technical excellence with business requirements, ensuring we solve the right problems at the right time.',
    icon: Zap,
    color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20'
  },
  {
    title: 'Continuous Mentor',
    subtitle: 'Growth & Culture',
    description: 'Sharing knowledge is as important as writing code. I actively participate in mentorship and knowledge-sharing sessions to foster technical growth.',
    icon: Message,
    color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20'
  }
];

export function WorkingStyleSection() {
  return (
    <div className="grid grid-cols-1 gap-4">
      {workingStyle.map((style, index) => (
        <InteractiveCard 
          key={index}
          title={style.title}
          subtitle={style.subtitle}
          description={style.description}
          icon={style.icon}
          color={style.color}
        />
      ))}
    </div>
  );
}
