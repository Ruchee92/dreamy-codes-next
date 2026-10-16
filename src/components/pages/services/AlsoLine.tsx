import { ArrowLink } from '../../home/Buttons';
import { ALSO } from './data';

/** The foot of the black stage plate: the smaller services, each opening its FAQ answer (#faq-*). */
const AlsoLine = () => (
  <div className="h-container sv2-also">
    <span className="sv2-also-rule" data-draw aria-hidden="true" />
    <p className="h-label sv2-also-k">Also</p>
    <ul className="sv2-also-list">
      {ALSO.map((a) => (
        <li key={a.slug}>
          <ArrowLink href={`#faq-${a.slug}`}>{a.label}</ArrowLink>
        </li>
      ))}
    </ul>
  </div>
);

export default AlsoLine;
