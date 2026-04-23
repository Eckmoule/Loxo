import Button from './Button';
import Icon from './Icon';
import './StatusMessage.css';

function StatusMessage({
    type = 'success', // 'success' ou 'error'
    title,
    message,
    buttonText,
    onButtonClick
}) {
    const config = {
        success: {
            iconBg: 'var(--positive-subtle)',
            icon: 'check'
        },
        error: {
            iconBg: 'var(--negative-subtle)',
            icon: 'error'
        }
    };

    const { iconBg, icon } = config[type];

    return (
        <main className="page-layout">
            <div className="status-message">
                <div className="status-message__icon" style={{ background: iconBg }}>
                    <Icon name={icon} size={28} />
                </div>
                <h2 className="status-message__title">{title}</h2>
                <p className="status-message__text">{message}</p>
                <Button onClick={onButtonClick} variant="primary">
                    {buttonText}
                </Button>
            </div>
        </main>
    );
}

export default StatusMessage;