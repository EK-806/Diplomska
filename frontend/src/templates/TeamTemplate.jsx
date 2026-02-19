import Template from '@/components/Template';

const TeamTemplate = () => {
    return (
        <Template>
            <div className="container mx-auto py-16 px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                <div className="relative left-0 md:left-1/4">
                    <img
                        src={'/team.png'}
                        alt="Team Working"
                        className="rounded-lg"/>
                </div>

                <div>
                    <h4 className="border-2 border-gray-900 dark:border-gray-100 text-primary dark:text-primary bg-primary/20 rounded-xl inline-block brightness-125 p-3 font-bold uppercase mb-1">
                    Team
                    </h4>

                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 my-4">
                        Provides Full Assistance <br/> From packaging to delivery right to your doorstep
                    </h2>
                    <p className="text-gray-900 dark:text-gray-100 mb-6">
                        We take care of every step of the process, ensuring your items are securely packed,
                        carefully handled, and delivered safely and on time. Our reliable service is designed
                        to give you peace of mind from start to finish.
                    </p>

                    <div className="space-y-4 text-[]">
                        <ProgressBar label="Air Freight" percentage={78} color="bg-accent"/>
                        <ProgressBar label="Land Transport" percentage={89} color="bg-accent"/>
                        <ProgressBar label="Ocean Freight" percentage={67} color="bg-accent"/>
                    </div>
                </div>
            </div>
        </Template>
    );
};

const ProgressBar = ({ label, percentage, color }) => {
    return (
        <div>
            <div className="flex justify-between mb-1">
                <span className="text-gray-800 dark:text-gray-100 font-medium">{label}</span>
                <span className="text-gray-800 dark:text-gray-100 font-medium">{percentage}%</span>
            </div>
            <div className="w-full bg-gray-500 rounded-full h-2.5">
                <div
                    className={`${color} h-2.5 rounded-full border-2 border-gray-900 dark:border-gray-100`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
};

export default TeamTemplate;