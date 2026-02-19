import ReactConfetti from 'react-confetti';

const PaymentCompleteLayout = ({ packageId }) => {
    return (
        <div>
            <ReactConfetti/>
            <h1>Payment Complete!</h1>
            <p>Your payment for {packageId} has been completed.</p>
        </div>
    );
};

export default PaymentCompleteLayout;