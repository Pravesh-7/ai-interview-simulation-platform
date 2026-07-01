import React from 'react';

export default function InterviewHistory({ history, onDelete, onDeleteAll }) {
  if (!history || history.length === 0) return null;

  return (
    <>
      <div className="mb-6 flex justify-between items-center mt-12">
        <h2 className="text-3xl font-bold">
          Interview History
        </h2>
        <button 
          onClick={onDeleteAll}
          className="bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition px-4 py-2 rounded-xl font-bold"
        >
          Delete All
        </button>
      </div>

      <div className="grid gap-6">
        {history.map((item) => (
          <div
            key={item._id}
            className="bg-gray-900 border border-gray-800 p-8 rounded-3xl shadow-xl"
          >
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center gap-4">
                <h3 className="text-2xl font-bold text-blue-400">
                  {item.role}
                </h3>
                <span className="bg-green-500/20 text-green-400 px-4 py-2 rounded-lg font-semibold">
                  {item.difficulty}
                </span>
              </div>
              <button
                onClick={() => onDelete(item._id)}
                className="text-red-400 hover:text-red-300 font-bold px-3 py-1 bg-gray-800 rounded-lg"
              >
                Delete
              </button>
            </div>

            {item.evaluation && (
              <div className="mb-4 bg-gray-800 p-4 rounded-xl flex justify-between items-center">
                <div>
                  <span className="text-gray-400 mr-2">Overall Score:</span>
                  <span className="text-2xl font-bold text-blue-400">{item.evaluation.overallScore}/100</span>
                </div>
                <div className="flex gap-4">
                  <div className="text-center">
                    <div className="text-xs text-gray-500">Tech</div>
                    <div className="font-bold text-green-400">{item.evaluation.technicalKnowledge}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500">Comm</div>
                    <div className="font-bold text-purple-400">{item.evaluation.communication}</div>
                  </div>
                </div>
              </div>
            )}

            <pre className="whitespace-pre-wrap text-gray-300 leading-8">
              {item.questions}
            </pre>
          </div>
        ))}
      </div>
    </>
  );
}
