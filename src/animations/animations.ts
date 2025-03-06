export const AIButtonAnimation = {
    // This would be a Lottie animation JSON object
    // For demonstration, we're using a mock object
    v: '5.8.1',
    fr: 30,
    ip: 0,
    op: 60,
    w: 100,
    h: 100,
    nm: 'AI Button Animation',
    ddd: 0,
    assets: [],
    layers: [
      {
        ddd: 0,
        ind: 1,
        ty: 4,
        nm: 'Circle',
        sr: 1,
        ks: {
          o: { a: 0, k: 100, ix: 11 },
          r: { a: 0, k: 0, ix: 10 },
          p: { a: 0, k: [50, 50, 0], ix: 2, l: 2 },
          a: { a: 0, k: [0, 0, 0], ix: 1, l: 2 },
          s: { a: 1, k: [], ix: 6, l: 2 }
        }
      }
    ]
  };
  
  export const PulseAnimation = `
    @keyframes pulse {
      0% {
        transform: scale(1);
        box-shadow: 0 0 0 0 rgba(79, 70, 229, 0.7);
      }
      70% {
        transform: scale(1.1);
        box-shadow: 0 0 0 10px rgba(79, 70, 229, 0);
      }
      100% {
        transform: scale(1);
        box-shadow: 0 0 0 0 rgba(79, 70, 229, 0);
      }
    }
  `;
  
  export const FadeInAnimation = `
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;