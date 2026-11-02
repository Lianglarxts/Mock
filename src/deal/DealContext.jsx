import { createContext, useContext, useMemo, useReducer } from 'react';
import { BUDGET } from '../data.js';
import { progress } from './derive.js';

// The ONLY things stored are the visitor's choices.
// Scores, prices, results and the verdict are always derived (see derive.js).
export const initialDeal = {
  started: false,
  brief: { goal: null, budget: BUDGET.start, product: null },
  creatorId: null,
  checkedId: null, // which creator the visitor has checked & trusted
  offer: null,
  terms: { deadlineDays: null, usageMonths: 1, paidAds: false, exclusive: false },
  escrowStep: 0, // 0 = nothing yet … 5 = money released
};

function reducer(deal, action) {
  switch (action.type) {
    case 'start':
      return { ...deal, started: true };
    // Brief changes re-score everything but keep later picks.
    case 'brief':
      return { ...deal, brief: { ...deal.brief, ...action.patch } };
    // A new creator invalidates the check, the price and the signed deal.
    case 'pickCreator':
      if (action.id === deal.creatorId) return deal;
      return { ...deal, creatorId: action.id, checkedId: null, offer: null, escrowStep: 0 };
    case 'confirmCheck':
      return { ...deal, checkedId: deal.creatorId };
    // Anything on the deal sheet changing means it has to be agreed again.
    case 'offer':
      return { ...deal, offer: action.value, escrowStep: 0 };
    case 'terms':
      return { ...deal, terms: { ...deal.terms, ...action.patch }, escrowStep: 0 };
    case 'escrowNext':
      return { ...deal, escrowStep: Math.min(5, deal.escrowStep + 1) };
    // "Try another choice": keep the brief, redo everything after it.
    case 'retry':
      return { ...deal, creatorId: null, checkedId: null, offer: null, escrowStep: 0 };
    case 'reset':
      return initialDeal;
    default:
      return deal;
  }
}

const DealCtx = createContext(null);

export function DealProvider({ children }) {
  const [deal, dispatch] = useReducer(reducer, initialDeal);
  const value = useMemo(() => ({ deal, dispatch, prog: progress(deal) }), [deal]);
  return <DealCtx.Provider value={value}>{children}</DealCtx.Provider>;
}

export const useDeal = () => useContext(DealCtx);
