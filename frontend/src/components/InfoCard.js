import React, { useState, useEffect } from 'react';
import "../Consumer.css"

const InfoCard = ({ title, emoji, cardKey, activeCard, toggleCard, fetchFunction, fields }) => {
  const [metrics, setMetrics] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchFunction();
        setMetrics(data || {});
      } catch (error) {
        console.error("Error fetching card data:", error);
        setMetrics({});
      } finally {
        setLoading(false);
      }
    };

    if (activeCard === cardKey) {
      fetchData();
    }
  }, [activeCard, cardKey, fetchFunction]);

  return (
    <div className="card" onClick={() => toggleCard(cardKey)}>
      <h3>{emoji} {title}</h3>
      {activeCard === cardKey && (
        <div className={`card-content ${activeCard === cardKey ? 'show' : ''}`}>
          {loading ? (
            <p>Loading...</p>
          ) : (
            fields.map(({ label, key, unit }) => (
              <p key={key}>
                {label}: {metrics[key] !== undefined ? metrics[key] : '-'}{unit || ''}
              </p>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default InfoCard;
