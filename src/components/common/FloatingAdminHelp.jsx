import { useState } from "react";

import { ADMIN_CONTACT } from "../../utils/constants";

function FloatingAdminHelp() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-24 right-4 z-50 flex flex-col items-end gap-3 sm:bottom-5 sm:right-5">
      {isOpen ? (
        <div className="soft-card max-w-[18rem] p-5 text-sm text-slate-700 shadow-soft sm:max-w-xs">
          <p className="section-kicker">Need Assistance?</p>
          <h3 className="mt-2 font-display text-xl font-semibold text-ink">Admin Support</h3>
          <p className="mt-3 leading-7 text-slate-600">
            For payment confirmation, registration issues, or squad changes, contact the admin
            directly.
          </p>
          <a
            className="mt-4 block text-base font-semibold text-field-700 hover:text-field-800"
            href={ADMIN_CONTACT.telUrl}
          >
            {ADMIN_CONTACT.displayPhone}
          </a>
          <a
            className="mt-2 inline-flex items-center rounded-full bg-field-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-field-700"
            href={ADMIN_CONTACT.whatsappUrl}
            rel="noreferrer"
            target="_blank"
          >
            Chat on WhatsApp
          </a>
        </div>
      ) : null}

        <button
          type="button"
          aria-label="Open admin support details"
          className="floating-help-button"
          onClick={() => setIsOpen((currentState) => !currentState)}
        >
          i
        </button>
    </div>
  );
}

export default FloatingAdminHelp;
