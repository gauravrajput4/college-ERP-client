import React from "react";
import { Check, AlertCircle } from "lucide-react";

const StepIndicator = ({ steps, currentStep, onStepClick }) => {
  return (
    <div className="w-full py-6">
      {/* Desktop Horizontal Stepper */}
      <div className="hidden md:flex items-center justify-between w-full max-w-3xl mx-auto">
        {steps.map((step, index) => {
          const isCurrent = step.number === currentStep;
          const isCompleted = step.isCompleted;
          const isError = step.hasError;

          return (
            <div key={step.number} className="flex flex-col items-center relative z-10 w-32">
              <button
                disabled={step.isDisabled && !isCompleted}
                onClick={() => isCompleted && onStepClick(step.number)}
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 relative
                  ${
                    isCompleted
                      ? "bg-green-500 border-green-500 text-white cursor-pointer"
                      : isCurrent
                      ? "bg-indigo-600 border-indigo-600 text-white shadow-[0_0_0_4px_rgba(79,70,229,0.2)]"
                      : isError
                      ? "bg-red-50 border-red-500 text-red-500"
                      : "bg-white border-gray-300 text-gray-400 cursor-not-allowed"
                  }
                `}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : isError ? (
                  <AlertCircle className="w-5 h-5" />
                ) : (
                  <span className="font-semibold">{step.number}</span>
                )}
                
                {/* Pulse animation for current step */}
                {isCurrent && (
                  <span className="absolute w-full h-full rounded-full animate-ping bg-indigo-400 opacity-20 -z-10" />
                )}
              </button>

              <div className="mt-3 text-center">
                <p className={`text-sm font-semibold ${isCurrent ? "text-indigo-900" : isCompleted ? "text-gray-900" : "text-gray-400"}`}>
                  {step.label}
                </p>
                <p className="text-xs text-gray-500 mt-1">{step.subtitle}</p>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={`absolute top-5 left-[50%] w-full h-[2px] -z-20 transition-all duration-500
                    ${isCompleted ? "bg-green-500" : "bg-gray-200"}
                  `}
                  style={{ width: "calc(100% + 40px)", left: "calc(50% + 20px)" }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile Vertical/Compact Stepper */}
      <div className="md:hidden flex space-x-2 w-full overflow-x-auto pb-4 hide-scrollbar px-4">
        {steps.map((step) => {
          const isCurrent = step.number === currentStep;
          const isCompleted = step.isCompleted;

          return (
            <button
              key={step.number}
              disabled={step.isDisabled && !isCompleted}
              onClick={() => isCompleted && onStepClick(step.number)}
              className={`flex flex-col flex-1 items-center justify-center p-3 rounded-lg border min-w-[100px] transition-all
                ${
                  isCurrent
                    ? "bg-indigo-50 border-indigo-500 shadow-sm"
                    : isCompleted
                    ? "bg-green-50 border-green-200"
                    : "bg-gray-50 border-gray-200 opacity-60"
                }
              `}
            >
              <div className={`flex items-center justify-center w-6 h-6 rounded-full mb-2
                ${isCompleted ? "bg-green-500 text-white" : isCurrent ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-500"}
              `}>
                {isCompleted ? <Check className="w-3 h-3" /> : <span className="text-xs font-bold">{step.number}</span>}
              </div>
              <span className={`text-xs font-medium text-center ${isCurrent ? "text-indigo-700" : "text-gray-600"}`}>
                {step.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;
