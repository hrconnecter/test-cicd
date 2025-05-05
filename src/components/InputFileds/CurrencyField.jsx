import { Controller } from "react-hook-form";

const CurrencyField = ({ type, name, control, label, error, selectedCurrency }) => {
    if (type === "salary") {
        return (
            <div className={`space-y-1`}>
                <label htmlFor={name} className={`${error && "text-red-500"
                    } font-semibold text-gray-500 text-md`}>
                    {label}
                </label>
                <Controller
                    control={control}
                    name={name}
                    render={({ field }) => (
                        <div className="flex items-center bg-white border rounded-md">
                            {/* Display Selected Currency */}
                            <span className="px-2">{selectedCurrency}</span>
                            {/* Salary Input */}
                            <input
                                {...field}
                                type="number"
                                min={0}
                                placeholder="Enter amount"
                                className="flex-1  border-none outline-none"
                                style={{
                                    height: '37px', // Adjust the height here
                                    padding: '0 8px', // Optional padding adjustment

                                }}
                            />
                        </div>
                    )}
                />
                <div className="h-4">
                    {error && <span className="text-red-500">{error.message}</span>}
                </div>
            </div>
        );
    }

    return null;
};

export default CurrencyField;
