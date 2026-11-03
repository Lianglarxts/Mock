import { createContext, useContext } from 'react';

// goTo(i) scrolls to room i (sideways on desktop, down on mobile).
export const NavCtx = createContext({ goTo: () => {}, current: 0, desktop: true, seen: new Set() });
export const useNav = () => useContext(NavCtx);

export const ROOMS = [
  { id: 'entrance', short: 'Start' },
  { id: 'brief', short: 'Brief', title: 'The Brief', question: 'Who are you, and what do you want?' },
  { id: 'match', short: 'Match', title: 'The Match', question: 'Who lines up with you?' },
  { id: 'check', short: 'Check', title: 'The Check', question: 'Can you trust them?' },
  { id: 'price', short: 'Price', title: 'The Price', question: 'What is fair?' },
  { id: 'deal', short: 'Deal', title: 'The Deal', question: 'Keep it safe.' },
  { id: 'result', short: 'Result', title: 'The Result', question: 'Was it worth it, for both of you?' },
  { id: 'exit', short: 'Exit', title: 'The Exit', question: 'Your deal, on one page.' },
];
