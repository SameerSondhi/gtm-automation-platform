import React from 'react';
import LeadCard from './LeadCard'; // You can reuse the same card OR make a flippable version

const LeadEnrichmentCards = ({ leads, refreshLeads }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {leads.map((lead) => (
        <LeadCard
          key={lead.id}
          lead={lead}
          refreshLeads={refreshLeads}
          showEnrichment={true} // optional prop if you need to show enrichment data
        />
      ))}
    </div>
  );
};

export default LeadEnrichmentCards;