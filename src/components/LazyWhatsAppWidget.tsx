"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { whenIdleAfterLoad } from '../utils/idle';

const WhatsAppWidget = dynamic(() => import('./WhatsAppWidget'), { ssr: false });

/**
 * The widget renders nothing until ~1.8s in, so its code (and motion/react with
 * it) is fetched after load and an idle moment instead of with the first paint
 * (D-073).
 */
const LazyWhatsAppWidget = () => {
  const [on, setOn] = useState(false);
  useEffect(() => whenIdleAfterLoad(() => setOn(true)), []);
  return on ? <WhatsAppWidget /> : null;
};

export default LazyWhatsAppWidget;
