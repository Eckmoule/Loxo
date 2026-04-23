import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { validateEmail, validateMessageLength } from '../../utils/validation';
import FormField from '../common/FormField';
import Button from '../common/Button';
import Icon from '../common/Icon';
import StatusMessage from '../common/StatusMessage';
import '../common/Input.css';
import './Contact.css';

const SUBJECTS = [
  'Question générale',
  'Problème technique',
  'Demande de données',
  'Partenariat',
  'Presse',
  'Autre',
];

function Contact({ onNavigate, user }) {
  const [form, setForm] = useState({
    email: user?.email || '',
    subject: '',
    message: ''
  });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [subjectOpen, setSubjectOpen] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};

    const emailError = validateEmail(form.email);
    if (emailError) e.email = emailError;

    if (!form.subject) e.subject = 'Veuillez choisir un sujet';

    const messageError = validateMessageLength(form.message, 10);
    if (messageError) e.message = messageError;

    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = validate();
    setErrors(e2);
    if (Object.keys(e2).length) return;

    setLoading(true);

    const { error } = await supabase
      .from('contact_messages')
      .insert([
        {
          email: form.email,
          subject: form.subject,
          message: form.message,
          user_id: user?.id || null,
        }
      ]);

    setLoading(false);

    if (error) {
      setErrors({ message: 'Erreur lors de l\'envoi. Veuillez réessayer.' });
      console.error('Erreur Supabase:', error);
    } else {
      setSent(true);
    }
  };

  if (sent) {
    return (
      <StatusMessage
        type="success"
        title="Message envoyé !"
        message="Nous avons bien reçu votre message et vous répondrons dans les meilleurs délais."
        buttonText="Retour à l'accueil"
        onButtonClick={() => onNavigate('home')}
      />
    );
  }

  return (
    <main className="page-layout">
      <div className="page-layout__background" />
      <div className="page-layout__gradient" />

      <div className="page-layout__content page-layout__content--contact">
        {/* Header */}
        <div className="page-header">
          <h1 className="page-header__title page-header__title--contact">Nous contacter</h1>
          <p className="page-header__subtitle">
            Une question, un problème ou une suggestion ? Nous lisons tous les messages.
          </p>
        </div>

        {/* Card */}
        <div className="page-card">
          <form onSubmit={handleSubmit} className="page-form page-form--contact">

            {/* Email */}
            <FormField label="Adresse e-mail" error={errors.email}>
              <input
                type="email"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                placeholder="vous@exemple.fr"
                disabled={!!user}
                className={`input ${errors.email ? 'input--error' : ''}`}
                style={user ? { cursor: 'not-allowed', opacity: 0.6 } : {}}
              />
            </FormField>

            {/* Subject */}
            <FormField label="Sujet" error={errors.subject}>
              <div className="subject-dropdown">
                <button
                  type="button"
                  onClick={() => setSubjectOpen(o => !o)}
                  className={`input subject-dropdown__button ${!form.subject ? 'subject-dropdown__button--placeholder' : ''} ${errors.subject ? 'input--error' : ''}`}
                >
                  {form.subject || 'Choisir un sujet…'}
                  <Icon
                    name="arrowDown"
                    size={14}
                    className={`subject-dropdown__arrow ${subjectOpen ? 'subject-dropdown__arrow--open' : ''}`}
                  />
                </button>
                {subjectOpen && (
                  <div className="subject-dropdown__menu">
                    {SUBJECTS.map(s => (
                      <button
                        key={s}
                        type="button"
                        onMouseDown={() => { set('subject', s); setSubjectOpen(false); }}
                        className={`subject-dropdown__item ${form.subject === s ? 'subject-dropdown__item--selected' : ''}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </FormField>

            {/* Message */}
            <FormField label="Message" error={errors.message}>
              <textarea
                value={form.message}
                onChange={e => set('message', e.target.value)}
                placeholder="Décrivez votre demande…"
                rows={5}
                className={`input input--textarea ${errors.message ? 'input--error' : ''}`}
              />
              <div className={`message-counter ${form.message.length < 10 ? 'message-counter--short' : 'message-counter--ok'}`}>
                {form.message.length} / 1000
              </div>
            </FormField>

            {/* Submit */}
            <Button type="submit" variant="primary" loading={loading}>
              {loading ? (
                <>
                  <Icon name="spinner" />
                  Envoi en cours…
                </>
              ) : (
                <>
                  <Icon name="send" size={14} color="white" />
                  Envoyer le message
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default Contact;