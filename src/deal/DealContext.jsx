import { createContext, useContext, useMemo, useReducer } from 'react';
import { BUDGET } from '../data.js';
import { fairRange, getBrand, getCreator, partnerId, progress } from './derive.js';

// The ONLY things stored are the visitor's choices.
// Scores, prices, results and the verdict are always derived (see derive.js).
export const initialDeal = {
  started: false,
  side: null, // 'brand' | 'creator'
  brandId: null, // brand side: picked in the brief · creator side: picked in the match
  creatorId: null, // brand side: picked in the match · creator side: picked in the brief
  brief: {
    goal: null, budget: BUDGET.start, // brand side
    minFee: null, longTerm: null, freedom: null, // creator side
  },
  checkedId: null, // which partner the visitor has checked & trusted
  offer: null,
  terms: { deadlineDays: null, usageMonths: 1, paidAds: false, exclusive: false },
  escrowStep: 0, // 0 = nothing yet … 5 = money released
};

const clearPartner = (deal) => ({
  ...deal,
  ...(deal.side === 'brand' ? { creatorId: null } : { brandId: null }),
  checkedId: null,
  offer: null,
  escrowStep: 0,
});

function reducer(deal, action) {
  switch (action.type) {
    // Picking (or switching) a side starts a fresh deal.
    case 'start':
      if (deal.started && deal.side === action.side) return deal;
      return { ...initialDeal, started: true, side: action.side };
    // Brief changes re-score everything but keep later picks.
    case 'brief':
      return { ...deal, brief: { ...deal.brief, ...action.patch } };
    // Brand side: who you are. Start the budget at what that brand usually spends.
    case 'pickBrand':
      if (action.id === deal.brandId) return deal;
      return { ...deal, brandId: action.id, brief: { ...deal.brief, budget: getBrand(action.id).budget } };
    // Creator side: who you are. Your price changes, so the offer and the signed deal go.
    case 'pickMe':
      if (action.id === deal.creatorId) return deal;
      return {
        ...deal,
        creatorId: action.id,
        brief: { ...deal.brief, minFee: fairRange(getCreator(action.id)).low },
        offer: null,
        escrowStep: 0,
      };
    // A new partner invalidates the check, the price and the signed deal.
    case 'pickPartner':
      if (action.id === partnerId(deal)) return deal;
      return {
        ...clearPartner(deal),
        ...(deal.side === 'brand' ? { creatorId: action.id } : { brandId: action.id }),
      };
    case 'confirmCheck':
      return { ...deal, checkedId: partnerId(deal) };
    // Anything on the deal sheet changing means it has to be agreed again.
    case 'offer':
      return { ...deal, offer: action.value, escrowStep: 0 };
    case 'terms':
      return { ...deal, terms: { ...deal.terms, ...action.patch }, escrowStep: 0 };
    case 'escrowNext':
      return { ...deal, escrowStep: Math.min(5, deal.escrowStep + 1) };
    // "Try another choice": keep the brief, redo everything after it.
    case 'retry':
      return clearPartner(deal);
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
