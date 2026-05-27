import './LoadingSpinner.css';

function LoadingSpinner({ message = 'Chargement des données...' }) {
    return (
        <div className="loading-spinner">
            <div className="loading-spinner__inner">
                <div className="loading-spinner__ring">
                    <div className="loading-spinner__ring-segment" />
                </div>
                <p className="loading-spinner__message">{message}</p>
            </div>
        </div>
    );
}

export default LoadingSpinner;
