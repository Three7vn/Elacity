import DraggableWrapper from './DraggableWrapper';

const Section = ({ title, children }) => (
  <div style={{ margin: '32px 0', border: '1px solid #eee', borderRadius: 8, padding: 16 }}>
    <h2 style={{ fontFamily: 'Poppins', fontSize: 20 }}>{title}</h2>
    {children}
  </div>
);

// Mock data for testing
const mockResearchData = {
  research_score: 0.85,
  title: "Deep Learning Approaches to Natural Language Processing",
  research_insights: [
    { insight: 'key_findings', level: 'Insight', description: 'Novel approach to attention mechanisms shows promise' },
    { insight: 'methodology_strength', level: 'Insight', description: 'Comprehensive evaluation across multiple benchmarks' },
    { insight: 'data_concern', level: 'Flaw', description: 'Limited dataset diversity may affect real-world applicability' },
    { insight: 'innovation_highlight', level: 'Insight', description: 'Introduces efficient training technique reducing compute by 40%' }
  ],
  explanation: "This paper presents strong research with novel innovations and comprehensive methodology."
};

// Animation styles
const pulseAnimation = {
  '@keyframes pulse': {
    '0%': { transform: 'scale(0.95)' },
    '50%': { transform: 'scale(1.05)' },
    '100%': { transform: 'scale(0.95)' }
  }
};

export default function TestAllComponents() {
  return (
    <div style={{ padding: 32 }}>
      <Section title="Loading State">
        <DraggableWrapper>
          <div id="elacity-results-panel" style={{
            width: '300px',
            background: 'linear-gradient(180deg, rgba(70,70,75,0.88) 0%, rgba(90,90,100,0.85) 100%)',
            borderRadius: '8px',
            padding: '15px',
            color: 'white'
          }}>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px'}}>
              <div id="elacity-svg-container" style={{
                position: 'relative',
                width: '40px',
                height: '40px',
                animation: 'pulse 2s infinite ease-in-out'
              }}>
                <svg id="elacity-blue-blob" width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.99009 15.3603C-0.195881 8.92559 7.68054 0.0433352 16.5397 2.32053C27.1673 5.79496 20.6482 11.4077 28.4576 13.1003C36.2671 14.793 38.073 17.6585 37.9167 22.4048C37.6385 30.8552 27.1823 29.3886 21.0798 35.9769C14.2834 43.3143 3.09987 36.1639 5.23235 29.9145C6.49486 26.2146 3.77053 20.6013 1.99009 15.3603Z" fill="#BEDBFF" fillOpacity="0.25"/>
                  <path d="M5.6412 15.0209C4.30708 9.68416 11.3463 3.06718 18.41 5.51229C26.8319 9.04408 21.1267 13.1192 27.3753 15.0209C33.6238 16.9227 34.8966 19.3566 34.4388 23.1713C33.6238 29.9632 25.2018 28.0614 19.7683 32.9516C13.717 38.3977 5.0978 31.8649 7.27124 26.9747C8.558 24.0795 6.72783 19.3677 5.6412 15.0209Z" fill="#8EC5FF"/>
                </svg>
              </div>
              <div style={{textAlign: 'center'}}>
                <div style={{fontWeight: 600, fontSize: '16px'}}>Elacity is thinking...</div>
                <div style={{fontSize: '14px', color: '#9F9FA9'}}>Analyzing paper content...</div>
              </div>
            </div>
          </div>
        </DraggableWrapper>
      </Section>

      <Section title="Results Panel">
        <DraggableWrapper>
          <div id="elacity-results-panel" style={{
            width: '300px',
            background: 'linear-gradient(180deg, rgba(70,70,75,0.88) 0%, rgba(90,90,100,0.85) 100%)',
            borderRadius: '8px',
            padding: '15px',
            color: 'white'
          }}>
            <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
              <div style={{fontSize: '12px', fontWeight: 600}}>Research Analysis</div>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
                <div style={{display: 'flex', alignItems: 'baseline', gap: '4px'}}>
                  <span style={{fontSize: '24px', fontWeight: 600}}>{Math.round(mockResearchData.research_score * 100)}</span>
                  <span style={{fontSize: '16px', color: '#9F9FA9'}}>/</span>
                  <span style={{fontSize: '12px', color: '#9F9FA9'}}>100</span>
                </div>
                <span style={{color: '#22c55e', fontSize: '12px', fontWeight: 600}}>Strong</span>
              </div>
              <div style={{height: '12px', background: '#27272A', borderRadius: '8px', overflow: 'hidden'}}>
                <div style={{
                  width: `${mockResearchData.research_score * 100}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)',
                  boxShadow: '12px 0px 34px rgba(37, 99, 235, 0.28)',
                  borderRadius: '8px'
                }}></div>
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
                <svg width="20" height="20" viewBox="0 -960 960 960" fill="#3b82f6">
                  <path d="M480-80q-26 0-47-12.5T400-126q-33 0-56.5-23.5T320-206v-142q-59-39-94.5-103T190-590q0-121 84.5-205.5T480-880q121 0 205.5 84.5T770-590q0 77-35.5 140T640-348v142q0 33-23.5 56.5T560-126q-12 21-33 33.5T480-80Zm-80-126h160v-36H400v36Zm0-76h160v-38H400v38Zm-8-118h58v-108l-88-88 42-42 76 76 76-76 42 42-88 88v108h58q54-26 88-76.5T690-590q0-88-61-149t-149-61q-88 0-149 61t-61 149q0 63 34 113.5t88 76.5Zm88-162Zm0-38Z"/>
                </svg>
                <span style={{fontSize: '12px', fontWeight: 600}}>
                  {mockResearchData.research_insights.length} research insight{mockResearchData.research_insights.length > 1 ? 's' : ''} identified
                </span>
              </div>
            </div>
          </div>
        </DraggableWrapper>
      </Section>

      <Section title="Research Button">
        <DraggableWrapper>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '8px',
            width: '157px',
            height: '37px',
            background: 'rgba(240, 242, 245, 0.7)',
            border: '1px solid rgba(210, 215, 225, 0.8)',
            borderRadius: '8px',
            cursor: 'pointer'
          }}>
            <span style={{fontSize: '13px', color: '#6B7280'}}>Start</span>
            <div style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
              <div style={{
                width: '19.8px',
                height: '19.8px',
                backgroundColor: '#3B82F6',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                e
              </div>
              <span style={{fontSize: '13px', color: '#3B82F6'}}>Research</span>
            </div>
          </div>
        </DraggableWrapper>
      </Section>
    </div>
  );
} 