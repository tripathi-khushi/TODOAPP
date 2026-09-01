import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

export const ProjectsCard = ({ onFilterCategory }) => {
  const projects = [
    {
      id: 1,
      title: 'Homework 15',
      subtitle: 'Autonomous Rover Bot',
      image: 'https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=300&auto=format&fit=crop&q=80',
    },
    {
      id: 2,
      title: 'Homework 10',
      subtitle: 'Logic Gate Breadboard',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="card-soft projects-widget-card">
      <div className="card-header-simple">
        <h3 className="card-title">My projects</h3>
      </div>

      <div className="projects-grid">
        {projects.map((project) => (
          <div 
            key={project.id} 
            className="project-card-item"
            onClick={() => onFilterCategory && onFilterCategory('Projects')}
            title="Filter by Projects"
          >
            <div className="project-thumbnail-wrapper">
              <img src={project.image} alt={project.title} className="project-thumb" />
              <span className="project-badge">Active</span>
            </div>
            <div className="project-info">
              <span className="project-label">{project.title}</span>
              <span className="project-subtitle">{project.subtitle}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ProjectsCard;
