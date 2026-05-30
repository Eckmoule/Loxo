import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import './Legal.css';

const TABS = [
    { id: 'mentions', label: 'Mentions légales' },
    { id: 'confidentialite', label: 'Confidentialité' },
    { id: 'cgu', label: 'CGU' },
];

function Legal() {
    const [activeTab, setActiveTab] = useState('mentions');

    return (
        <>
            <Helmet>
                <title>Informations légales | Loxo</title>
                <meta name="robots" content="noindex" />
            </Helmet>

            <div className="legal">
                <main className="legal__main">

                    {/* Header */}
                    <div className="legal__header">
                        <h1 className="legal__title">Informations légales</h1>
                        <p className="legal__subtitle">
                            Mentions légales, politique de confidentialité et conditions d'utilisation
                        </p>
                    </div>

                    {/* Tabs */}
                    <div className="legal__tabs">
                        {TABS.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`legal__tab ${activeTab === tab.id ? 'legal__tab--active' : ''}`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    <div className="legal__content">

                        {/* Mentions légales */}
                        {activeTab === 'mentions' && (
                            <div className="legal__section">
                                <h2>Mentions légales</h2>
                                <p className="legal__date">Dernière mise à jour : mai 2025</p>

                                <h3>Éditeur du site</h3>
                                <p>
                                    Le site Loxo est édité à titre personnel et non commercial.
                                    Conformément à l'article 6-III-2 de la loi n°2004-575 du 21 juin 2004
                                    pour la Confiance dans l'Économie Numérique (LCEN), les informations
                                    permettant d'identifier l'éditeur sont tenues à disposition des autorités
                                    compétentes sur demande.
                                </p>
                                <p>
                                    <strong>Localisation :</strong> Lyon, France<br />
                                    <strong>Contact :</strong> <a href="mailto:loxo.immo@gmail.com">loxo.immo@gmail.com</a>
                                </p>

                                <h3>Hébergement</h3>
                                <p>
                                    Ce site est hébergé par :<br />
                                    <strong>Vercel Inc.</strong><br />
                                    440 N Barranca Ave #4133<br />
                                    Covina, CA 91723, États-Unis<br />
                                    <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">vercel.com</a>
                                </p>

                                <h3>Source des données</h3>
                                <p>
                                    Les données immobilières présentées sur ce site proviennent de la base
                                    <strong> Demandes de Valeurs Foncières (DVF)</strong>, publiée et mise à
                                    disposition par le Ministère de l'Économie et des Finances.
                                </p>
                                <p>
                                    Ces données sont disponibles sur{' '}
                                    <a href="https://data.gouv.fr" target="_blank" rel="noopener noreferrer">data.gouv.fr</a>
                                    {' '}sous{' '}
                                    <a href="https://www.etalab.gouv.fr/licence-ouverte-open-licence" target="_blank" rel="noopener noreferrer">
                                        Licence Ouverte Etalab 2.0
                                    </a>.
                                </p>
                                <div className="legal__credit">
                                    Données DVF © Ministère de l'Économie — Licence Ouverte Etalab 2.0 — Source : data.gouv.fr
                                </div>

                                <h3>Propriété intellectuelle</h3>
                                <p>
                                    Le code source, le design et les éléments graphiques de Loxo sont la
                                    propriété de l'éditeur. Toute reproduction sans autorisation est interdite.
                                    Les données DVF restent la propriété du Ministère de l'Économie et sont
                                    soumises à la Licence Ouverte Etalab 2.0.
                                </p>
                            </div>
                        )}

                        {/* Confidentialité */}
                        {activeTab === 'confidentialite' && (
                            <div className="legal__section">
                                <h2>Politique de confidentialité</h2>
                                <p className="legal__date">Dernière mise à jour : mai 2025</p>

                                <h3>Responsable du traitement</h3>
                                <p>
                                    L'éditeur de Loxo est responsable du traitement des données personnelles
                                    collectées via ce site. Contact : <a href="mailto:loxo.immo@gmail.com">loxo.immo@gmail.com</a>
                                </p>

                                <h3>Données collectées</h3>
                                <p>Loxo collecte uniquement les données strictement nécessaires au fonctionnement du service :</p>

                                <table className="legal__table">
                                    <thead>
                                        <tr>
                                            <th>Donnée</th>
                                            <th>Quand</th>
                                            <th>Finalité</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Adresse email</td>
                                            <td>Inscription / connexion Google</td>
                                            <td>Authentification et alertes</td>
                                        </tr>
                                        <tr>
                                            <td>Communes suivies</td>
                                            <td>Clic sur "Suivre"</td>
                                            <td>Envoi d'alertes DVF</td>
                                        </tr>
                                        <tr>
                                            <td>Messages de contact</td>
                                            <td>Formulaire de contact</td>
                                            <td>Réponse aux demandes</td>
                                        </tr>
                                    </tbody>
                                </table>

                                <h3>Durée de conservation</h3>
                                <p>
                                    Les données sont conservées pendant <strong>3 ans</strong> à compter
                                    de la dernière activité sur le compte. Les messages de contact sont
                                    conservés <strong>1 an</strong>.
                                </p>

                                <h3>Cookies et analytics</h3>
                                <p>
                                    Loxo utilise <strong>Umami Analytics</strong>, une solution respectueuse
                                    de la vie privée qui :
                                </p>
                                <ul>
                                    <li>Ne dépose aucun cookie sur votre appareil</li>
                                    <li>N'utilise pas votre adresse IP complète</li>
                                    <li>Ne partage aucune donnée avec des tiers</li>
                                    <li>Est conforme au RGPD sans nécessiter de bandeau de consentement</li>
                                </ul>

                                <h3>Vos droits (RGPD)</h3>
                                <p>Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :</p>
                                <ul>
                                    <li><strong>Droit d'accès</strong> : obtenir une copie de vos données</li>
                                    <li><strong>Droit de rectification</strong> : corriger vos données</li>
                                    <li><strong>Droit à l'effacement</strong> : supprimer votre compte et vos données</li>
                                    <li><strong>Droit à la portabilité</strong> : recevoir vos données dans un format lisible</li>
                                    <li><strong>Droit d'opposition</strong> : vous opposer à certains traitements</li>
                                </ul>
                                <p>
                                    Pour exercer ces droits, contactez-nous à{' '}
                                    <a href="mailto:loxo.immo@gmail.com">loxo.immo@gmail.com</a>.
                                    Nous nous engageons à répondre dans un délai de 30 jours.
                                </p>

                                <h3>Partage des données</h3>
                                <p>
                                    Vos données ne sont jamais vendues ni partagées avec des tiers à des
                                    fins commerciales. Elles sont uniquement traitées par les prestataires
                                    techniques nécessaires au fonctionnement du service :
                                </p>
                                <ul>
                                    <li><strong>Supabase</strong> (base de données) — États-Unis / Europe</li>
                                    <li><strong>Vercel</strong> (hébergement) — États-Unis</li>
                                    <li><strong>Google</strong> (authentification OAuth) — si vous utilisez "Connexion avec Google"</li>
                                </ul>
                            </div>
                        )}

                        {/* CGU */}
                        {activeTab === 'cgu' && (
                            <div className="legal__section">
                                <h2>Conditions Générales d'Utilisation</h2>
                                <p className="legal__date">Dernière mise à jour : mai 2025</p>

                                <h3>1. Présentation du service</h3>
                                <p>
                                    Loxo est un service gratuit de visualisation des prix immobiliers en France,
                                    basé sur les données officielles DVF (Demandes de Valeurs Foncières).
                                    L'accès au service est libre et ne nécessite pas de création de compte,
                                    sauf pour la fonctionnalité d'alertes.
                                </p>

                                <h3>2. Accès au service</h3>
                                <p>
                                    L'éditeur se réserve le droit de modifier, suspendre ou interrompre
                                    l'accès au service à tout moment, notamment pour maintenance, sans
                                    préavis ni compensation. Le service est fourni "tel quel", sans garantie
                                    de disponibilité continue.
                                </p>

                                <h3>3. Données DVF — Exactitude et limites</h3>
                                <p>
                                    Les données présentées sur Loxo proviennent de la base DVF officielle
                                    publiée par le Ministère de l'Économie. Bien que ces données soient
                                    officielles, l'éditeur ne peut garantir :
                                </p>
                                <ul>
                                    <li>L'exactitude ou l'exhaustivité des données</li>
                                    <li>L'absence d'erreurs dans les données sources</li>
                                    <li>La mise à jour en temps réel (les données sont mises à jour semestriellement)</li>
                                </ul>
                                <p>
                                    <strong>Les informations présentées ne constituent pas un conseil immobilier
                                        professionnel</strong> et ne doivent pas être utilisées comme seule base
                                    de décision pour une transaction immobilière.
                                </p>

                                <h3>4. Comptes utilisateurs</h3>
                                <p>
                                    La création d'un compte est nécessaire pour utiliser la fonctionnalité
                                    d'alertes. L'utilisateur est responsable de la confidentialité de ses
                                    identifiants. L'éditeur se réserve le droit de suspendre un compte en
                                    cas d'utilisation abusive.
                                </p>

                                <h3>5. Usage autorisé</h3>
                                <p>Il est interdit d'utiliser Loxo pour :</p>
                                <ul>
                                    <li>Extraire massivement les données (scraping)</li>
                                    <li>Toute activité illégale ou frauduleuse</li>
                                    <li>Surcharger intentionnellement les serveurs</li>
                                    <li>Revendre ou redistribuer les données sans mentionner la source DVF</li>
                                </ul>

                                <h3>6. Limitation de responsabilité</h3>
                                <p>
                                    L'éditeur ne saurait être tenu responsable des dommages directs ou
                                    indirects résultant de l'utilisation du service ou de l'impossibilité
                                    d'y accéder, ni des décisions prises sur la base des informations
                                    présentées.
                                </p>

                                <h3>7. Droit applicable</h3>
                                <p>
                                    Les présentes CGU sont soumises au droit français. En cas de litige,
                                    les tribunaux français seront compétents.
                                </p>

                                <h3>8. Contact</h3>
                                <p>
                                    Pour toute question concernant ces CGU :{' '}
                                    <a href="mailto:loxo.immo@gmail.com">loxo.immo@gmail.com</a>
                                </p>
                            </div>
                        )}
                    </div>

                </main>
            </div>
        </>
    );
}

export default Legal;
