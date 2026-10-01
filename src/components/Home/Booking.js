import React, { useContext } from 'react';
import Cal from '@calcom/embed-react';
import { ThemeContext } from '../Page';

// Path after cal.com/, e.g. 'jaredrudnicki/30min'. Leave empty to hide booking.
export const CAL_LINK = 'jared-rudnicki-fcywp3';

const Booking = ({ onClose }) => {
    const theme = useContext(ThemeContext);

    return (
        <aside id="book" className="jr-cal-panel" aria-label="Book a call">
            <div className="jr-cal-head">
                <span className="jr-label">Book a call</span>
                <button type="button" className="jr-cal-close" onClick={onClose} aria-label="Close booking">
                    ×
                </button>
            </div>
            <Cal
                // Remount on theme change so the embed picks up the new colors.
                key={theme}
                className="jr-cal"
                calLink={CAL_LINK}
                config={{ theme, layout: 'month_view' }}
            />
        </aside>
    );
};

export default Booking;
