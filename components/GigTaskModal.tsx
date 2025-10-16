import React, { useState } from 'react';
import type { ScoredNiche } from '../types';

interface GigTaskModalProps {
  niche: ScoredNiche | null;
  onClose: () => void;
  isOpen: boolean;
}

const CopyButton: React.FC<{ textToCopy: string }> = ({ textToCopy }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            className={`absolute top-2 right-2 text-xs px-2 py-1 rounded transition-colors ${copied ? 'bg-emerald-500 text-white' : 'bg-gray-600 hover:bg-gray-500 text-gray-200'}`}
        >
            {copied ? 'Copied!' : 'Copy'}
        </button>
    );
};


export const GigTaskModal: React.FC<GigTaskModalProps> = ({ niche, onClose, isOpen }) => {
  if (!isOpen || !niche) return null;

  // Dynamic content generation
  const gigTitles = [
    `I will be your expert in ${niche.niche}`,
    `I will provide professional ${niche.niche} services`,
    `I will help you with high-quality ${niche.niche}`,
  ];

  const gigDescription = `Are you looking for top-tier ${niche.niche}? Look no further!\n\n${niche.description}\n\nI provide a comprehensive service that includes:\n- Feature A\n- Feature B\n- Feature C\n\nPlease contact me before ordering to discuss your project requirements. Let's create something amazing together!`;

  const tags = [...new Set(niche.niche.toLowerCase().split(' ').concat(niche.niche.toLowerCase()))].join(', ');

  const pricing = {
      basic: Math.round(niche.averagePrice * 0.5),
      standard: niche.averagePrice,
      premium: Math.round(niche.averagePrice * 1.8),
  };

  const coverImageTip = "Tip: Create a visually appealing cover image. Use a clean font, high-quality icons, and showcase a key benefit of your service. A good format is a before-and-after or a sample of the final product.";

  const faqs = `Q: What is your delivery time?\nA: My standard delivery is 3-5 days, but I offer a 24-hour express delivery gig extra.\n\nQ: How many revisions are included?\nA: I include 2 rounds of revisions in all my packages to ensure you are 100% satisfied with the final result.`;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 transition-opacity"
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 rounded-lg shadow-2xl p-6 border border-gray-700 w-full max-w-2xl mx-4 transform transition-all max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-gray-600 pb-3 mb-4 sticky top-0 bg-gray-800 -mt-6 -mx-6 px-6 pt-6 z-10">
          <h2 className="text-xl font-bold text-emerald-400">Turn "{niche.niche}" into a Gig</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
        </div>
        
        <div className="space-y-6 text-gray-300">
            {/* Gig Title */}
            <div>
                <h3 className="font-semibold text-lg mb-2 text-white">1. Gig Title</h3>
                <div className="space-y-2">
                    {gigTitles.map((title, index) => (
                         <div key={index} className="relative bg-gray-900/70 p-3 pr-16 rounded-md border border-gray-700">
                            <p className="text-sm font-mono">{title}</p>
                            <CopyButton textToCopy={title} />
                        </div>
                    ))}
                </div>
            </div>

             {/* Gig Description */}
            <div>
                <h3 className="font-semibold text-lg mb-2 text-white">2. Gig Description</h3>
                <div className="relative bg-gray-900/70 p-3 pr-16 rounded-md border border-gray-700">
                    <pre className="text-sm font-sans whitespace-pre-wrap">{gigDescription}</pre>
                    <CopyButton textToCopy={gigDescription} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pricing */}
                <div>
                    <h3 className="font-semibold text-lg mb-2 text-white">3. Pricing Tiers</h3>
                    <div className="bg-gray-900/70 p-4 rounded-md border border-gray-700 space-y-2">
                        <p className="text-sm"><strong>Basic:</strong> ${pricing.basic}</p>
                        <p className="text-sm"><strong>Standard:</strong> ${pricing.standard} (Recommended)</p>
                        <p className="text-sm"><strong>Premium:</strong> ${pricing.premium}</p>
                    </div>
                </div>

                {/* Tags */}
                <div>
                    <h3 className="font-semibold text-lg mb-2 text-white">4. Tags / Keywords</h3>
                    <div className="relative bg-gray-900/70 p-3 pr-16 rounded-md border border-gray-700">
                        <p className="text-sm font-mono">{tags}</p>
                        <CopyButton textToCopy={tags} />
                    </div>
                </div>
            </div>

             {/* Cover Image */}
            <div>
                <h3 className="font-semibold text-lg mb-2 text-white">5. Cover Image</h3>
                <div className="bg-gray-900/70 p-4 rounded-md border border-gray-700">
                    <p className="text-sm italic text-gray-400">{coverImageTip}</p>
                </div>
            </div>
            
             {/* FAQ */}
            <div>
                <h3 className="font-semibold text-lg mb-2 text-white">6. FAQ Section</h3>
                <div className="relative bg-gray-900/70 p-3 pr-16 rounded-md border border-gray-700">
                    <pre className="text-sm font-sans whitespace-pre-wrap">{faqs}</pre>
                    <CopyButton textToCopy={faqs} />
                </div>
            </div>
        </div>

        <div className="mt-6 text-right border-t border-gray-600 pt-4 -mx-6 px-6 pb-0">
          <button
            onClick={onClose}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};