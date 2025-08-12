import React, { useState } from 'react';
import { ExpandMore, MoreVert } from '@mui/icons-material';
import faqData from '../data/json/faq.json';

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full py-10">
      <div className="bg-white px-2">
        <div className="container mx-auto max-w-8xl bg-black/70 rounded-2xl p-4 relative -mt-32 z-10">
          <div className="w-full">
            <h1 className="text-4xl lg:text-3xl font-bold text-white border-b-10 border-white pb-4">
              Foire aux Questions
            </h1>
          </div>
          
          <div className="bg-white mt-8 rounded-2xl shadow-2xl border border-gray-100 p-8 lg:p-12">
            <div className="space-y-0">
              {faqData.questions.map((faq, index) => (
                <div key={faq.id}>
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                  >
                    <h3 className="text-lg lg:text-lg font-bold text-gray-800">
                      Question N°{faq.id}
                    </h3>
                    <div className="flex-shrink-0">
                      <ExpandMore
                        className={`w-6 h-6 text-gray-600 transition-transform duration-300 ${
                          openIndex === index ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="px-0 pb-6">
                      <div className="border-t border-gray-200 pt-4">
                        <p className="text-gray-600 leading-relaxed text-base lg:text-md">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>

                  {index < faqData.questions.length - 1 && (
                    <div className="border-b border-gray-200"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
            <div className="flex justify-end mt-8">
              <button className="bg-white hover:bg-gray-200 text-black font-semibold py-3 px-6 rounded-lg transition-colors duration-300 flex items-center gap-2">
                VOIR PLUS
                <MoreVert className="w-5 h-5" />
              </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Faq;