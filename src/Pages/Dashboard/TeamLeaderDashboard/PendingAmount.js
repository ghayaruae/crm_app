import CountUp from "react-countup";
import "./PendingAmount.css";

const PendingAmount = ({ pending_amount = 0 }) => {
    return (
        <div className="pending-alert">
            <div className="pending-content">

                {/* Icon Section */}
                <div className="pending-icon">
                    <i className="mdi mdi-clock-outline" style={{ fontSize: '32px' }}></i>
                </div>

                {/* Text Section */}
                <div>
                    <h5 className="pending-title">Pending Amount</h5>

                    <h2 className="pending-amount">
                        AED <CountUp
                            start={0}
                            end={parseFloat(pending_amount)}
                            decimals={2}
                            duration={2.5}
                            separator=","
                        />
                    </h2>

                    <p className="pending-subtext">
                        This is the total pending money from in-process orders.
                    </p>

                    {/* Status indicator */}
                    <div className="pending-status">
                        <span className="status-dot"></span>
                        Awaiting clearance
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PendingAmount;