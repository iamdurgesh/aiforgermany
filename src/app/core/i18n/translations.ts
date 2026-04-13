import { AppLocale } from './locale.model';

export interface TranslationDictionary {
  navigation: {
    home: string;
    articles: string;
    topics: string;
    about: string;
    newsletter: string;
  };
  common: {
    language: string;
    english: string;
    german: string;
    stories: string;
    readTime: string;
    readArticle: string;
    keyTakeaways: string;
    relatedCoverage: string;
    moreOnThisTopic: string;
    backToArticles: string;
    returnHome: string;
  };
  header: {
    primaryNavigation: string;
    joinNewsletter: string;
  };
  footer: {
    heading: string;
    navigate: string;
    coverageThemes: string;
    blurb: string;
    copyright: string;
    themes: {
      industry: string;
      startups: string;
      research: string;
      policy: string;
    };
  };
  newsletterCta: {
    eyebrow: string;
    title: string;
    description: string;
    button: string;
  };
  content: {
    categories: {
      industry: string;
      startups: string;
      research: string;
      policy: string;
    };
  };
  pages: {
    home: {
      seo: {
        title: string;
        description: string;
      };
      hero: {
        eyebrow: string;
        title: string;
        description: string;
        latestCoverage: string;
        exploreTopics: string;
        readyValue: string;
        coverageAreas: string;
        scalableFoundation: string;
      };
      carousel: {
        slides: {
          frontier: {
            title: string;
            subtitle: string;
            alt: string;
          };
          industry: {
            title: string;
            subtitle: string;
            alt: string;
          };
          research: {
            title: string;
            subtitle: string;
            alt: string;
          };
          mobility: {
            title: string;
            subtitle: string;
            alt: string;
          };
          governance: {
            title: string;
            subtitle: string;
            alt: string;
          };
          ecosystem: {
            title: string;
            subtitle: string;
            alt: string;
          };
        };
      };
      featured: {
        eyebrow: string;
        title: string;
        description: string;
      };
      topics: {
        eyebrow: string;
        title: string;
        description: string;
      };
      editorialDirection: {
        eyebrow: string;
        title: string;
        bodyOne: string;
        bodyTwo: string;
      };
    };
    articles: {
      seo: {
        title: string;
        description: string;
      };
      intro: {
        eyebrow: string;
        title: string;
        description: string;
      };
    };
    articleDetail: {
      missing: {
        seoTitle: string;
        seoDescription: string;
        eyebrow: string;
        title: string;
      };
    };
    topics: {
      seo: {
        title: string;
        description: string;
      };
      intro: {
        eyebrow: string;
        title: string;
        description: string;
      };
    };
    about: {
      seo: {
        title: string;
        description: string;
      };
      intro: {
        eyebrow: string;
        title: string;
        description: string;
      };
      body: {
        one: string;
        two: string;
      };
      principles: {
        title: string;
        one: string;
        two: string;
        three: string;
      };
    };
    newsletter: {
      seo: {
        title: string;
        description: string;
      };
      intro: {
        eyebrow: string;
        title: string;
        description: string;
      };
      body: {
        one: string;
        two: string;
      };
      form: {
        name: string;
        namePlaceholder: string;
        email: string;
        emailPlaceholder: string;
        button: string;
      };
      expectations: {
        title: string;
        one: string;
        two: string;
        three: string;
      };
    };
    notFound: {
      seo: {
        title: string;
        description: string;
      };
      eyebrow: string;
      title: string;
      description: string;
    };
  };
}

type Primitive = string | number | boolean | null | undefined;

type NestedKeyOf<T> = {
  [K in Extract<keyof T, string>]: T[K] extends Primitive
    ? K
    : T[K] extends object
      ? `${K}.${NestedKeyOf<T[K]>}`
      : K;
}[Extract<keyof T, string>];

export type TranslationKey = NestedKeyOf<TranslationDictionary>;

export const translations: Record<AppLocale, TranslationDictionary> = {
  en: {
    navigation: {
      home: 'Home',
      articles: 'Articles',
      topics: 'Topics',
      about: 'About',
      newsletter: 'Newsletter'
    },
    common: {
      language: 'Language',
      english: 'English',
      german: 'German',
      stories: '{count} stories',
      readTime: '{count} min read',
      readArticle: 'Read article',
      keyTakeaways: 'Key takeaways',
      relatedCoverage: 'Related coverage',
      moreOnThisTopic: 'More on this topic',
      backToArticles: 'Back to articles',
      returnHome: 'Return home'
    },
    header: {
      primaryNavigation: 'Primary',
      joinNewsletter: 'Join newsletter'
    },
    footer: {
      heading: 'Independent coverage of AI across Germany’s industrial and innovation landscape.',
      navigate: 'Navigate',
      coverageThemes: 'Coverage themes',
      blurb: 'A concise weekly briefing on AI in German industry, startups, research, and policy.',
      copyright: '© 2026 AIforGermany',
      themes: {
        industry: 'Industry 5.0',
        startups: 'German AI startups',
        research: 'Research ecosystem',
        policy: 'Policy and regulation'
      }
    },
    newsletterCta: {
      eyebrow: 'Newsletter',
      title: 'Subscribe to the weekly AIforGermany briefing',
      description:
        'A concise weekly dispatch covering German AI industry moves, startup traction, research signals, and policy developments.',
      button: 'View newsletter page'
    },
    content: {
      categories: {
        industry: 'Industry',
        startups: 'Startups',
        research: 'Research',
        policy: 'Policy'
      }
    },
    pages: {
      home: {
        seo: {
          title: 'AI for Germany',
          description:
            'AIforGermany is a modern editorial platform covering AI across German industry, startups, research, policy, and innovation.'
        },
        hero: {
          eyebrow: 'AI in Germany',
          title: 'A clean editorial platform for understanding Germany’s AI transition.',
          description:
            'AIforGermany is designed to track how artificial intelligence is reshaping German industry, startups, research institutions, policy agendas, and the broader innovation ecosystem.',
          latestCoverage: 'Read latest coverage',
          exploreTopics: 'Explore topics',
          readyValue: 'Ready',
          coverageAreas: 'Core coverage areas spanning industry, startups, research, policy, and innovation.',
          scalableFoundation: 'Foundation prepared for reports, directories, and data-driven category pages.'
        },
        carousel: {
          slides: {
            frontier: {
              title: 'AI Frontier',
              subtitle: 'A premium opening frame for Germany’s next phase of industrial, civic, and research AI.',
              alt: 'Futuristic AI visual introducing Germany’s technology transition'
            },
            industry: {
              title: 'Smart Industry',
              subtitle: 'AI-driven factories, robotics, and precision automation across Germany’s industrial base.',
              alt: 'Industrial robotics and connected production systems'
            },
            research: {
              title: 'Research and Innovation',
              subtitle: 'Scientific discovery, applied institutes, and sovereign AI capability moving into real systems.',
              alt: 'Advanced laboratory environment with AI research context'
            },
            mobility: {
              title: 'Clean Mobility',
              subtitle: 'Autonomous transport, efficient fleets, and software-defined mobility infrastructure.',
              alt: 'Modern vehicle and sustainable mobility technology'
            },
            governance: {
              title: 'Digital Governance',
              subtitle: 'Public infrastructure, policy oversight, and compliant AI deployment at national scale.',
              alt: 'Modern civic architecture representing digital governance'
            },
            ecosystem: {
              title: 'National AI Ecosystem',
              subtitle: 'Connected institutions, startups, infrastructure, and public capacity shaping Germany’s AI stack.',
              alt: 'Connected AI ecosystem visual for Germany'
            }
          }
        },
        featured: {
          eyebrow: 'Featured coverage',
          title: 'Signals that matter across Germany’s AI landscape',
          description:
            'The initial article framework is ready for editorial publishing, category growth, and future content operations.'
        },
        topics: {
          eyebrow: 'Topics',
          title: 'Built around the themes that define the German AI conversation',
          description:
            'The site structure supports editorial topic hubs now and leaves room for richer category pages later.'
        },
        editorialDirection: {
          eyebrow: 'Editorial direction',
          title: 'Minimal now, scalable later.',
          bodyOne:
            'This starter foundation already supports a landing page, article index, article detail view, topic overview, newsletter section, about page, and 404 experience.',
          bodyTwo:
            'The content layer is intentionally simple and mock-data driven so future work can introduce a CMS, markdown pipeline, API, or static content workflow without forcing a structural rewrite.'
        }
      },
      articles: {
        seo: {
          title: 'Articles',
          description:
            'Browse AIforGermany coverage across industry, startups, research, and policy in a clean editorial article index.'
        },
        intro: {
          eyebrow: 'Articles',
          title: 'Reporting and analysis on AI across Germany',
          description:
            'This starter index is ready to evolve into a richer editorial archive with filters, pagination, authors, and structured content sources.'
        }
      },
      articleDetail: {
        missing: {
          seoTitle: 'Article not found',
          seoDescription: 'The requested article could not be found.',
          eyebrow: 'Missing article',
          title: 'This article does not exist in the mock content set yet.'
        }
      },
      topics: {
        seo: {
          title: 'Topics',
          description:
            'Explore AIforGermany topics across Industry 5.0, startups, research, and policy in a scalable category overview.'
        },
        intro: {
          eyebrow: 'Topics',
          title: 'Editorial hubs for the themes shaping AI in Germany',
          description:
            'These topic blocks can later evolve into richer category pages with timelines, reports, data cards, and filtered archives.'
        }
      },
      about: {
        seo: {
          title: 'About',
          description:
            'Learn about the editorial mission behind AIforGermany and how the platform covers AI across the German ecosystem.'
        },
        intro: {
          eyebrow: 'About',
          title: 'A publication framework for making AI in Germany legible',
          description:
            'AIforGermany is positioned as a clean editorial platform covering how artificial intelligence shapes German industrial strength, startup momentum, research transfer, and public capability.'
        },
        body: {
          one:
            'The initial build is intentionally minimal and professional. It emphasizes strong hierarchy, content-first layouts, and a maintainable Angular structure that can scale into richer publishing workflows.',
          two:
            'From here, the project can grow into long-form reports, startup directories, regional ecosystem pages, and data-backed topic hubs without needing to replace the core shell.'
        },
        principles: {
          title: 'Editorial principles',
          one: 'Explain how AI affects German industry, not just how the technology works in theory.',
          two:
            'Connect research, startups, public institutions, and enterprise adoption into one coherent narrative.',
          three: 'Prioritize clarity, context, and practical relevance over hype.'
        }
      },
      newsletter: {
        seo: {
          title: 'Newsletter',
          description: 'Explore the AIforGermany newsletter section and its weekly briefing on AI across Germany.'
        },
        intro: {
          eyebrow: 'Newsletter',
          title: 'A weekly briefing on AI across Germany',
          description:
            'The current page is intentionally simple and ready for a future email provider or custom subscription flow.'
        },
        body: {
          one:
            'The newsletter can become the editorial heartbeat of the platform: a concise digest that helps readers keep track of industrial AI deployments, startup momentum, research transfer, and policy shifts without noise.',
          two:
            'The form below is a placeholder UI only. It is designed to be swapped later for a provider integration, custom API, or CMS-connected sign-up workflow.'
        },
        form: {
          name: 'Name',
          namePlaceholder: 'Ada Lovelace',
          email: 'Email',
          emailPlaceholder: 'you@example.com',
          button: 'Subscription integration comes next'
        },
        expectations: {
          title: 'What subscribers should expect',
          one: 'A weekly summary of the most relevant AI signals across Germany.',
          two: 'Short analysis on industrial adoption, startups, research, and policy.',
          three: 'A format designed for busy operators, founders, researchers, and policymakers.'
        }
      },
      notFound: {
        seo: {
          title: 'Page not found',
          description: 'The requested page could not be found on AIforGermany.'
        },
        eyebrow: '404',
        title: 'This page is not part of the current AIforGermany route map.',
        description: 'The routing foundation is ready, but this specific URL does not map to a page yet.'
      }
    }
  },
  de: {
    navigation: {
      home: 'Start',
      articles: 'Artikel',
      topics: 'Themen',
      about: 'Über uns',
      newsletter: 'Newsletter'
    },
    common: {
      language: 'Sprache',
      english: 'Englisch',
      german: 'Deutsch',
      stories: '{count} Beiträge',
      readTime: '{count} Min. Lesezeit',
      readArticle: 'Artikel lesen',
      keyTakeaways: 'Kernaussagen',
      relatedCoverage: 'Passende Beiträge',
      moreOnThisTopic: 'Mehr zu diesem Thema',
      backToArticles: 'Zurück zu den Artikeln',
      returnHome: 'Zur Startseite'
    },
    header: {
      primaryNavigation: 'Hauptnavigation',
      joinNewsletter: 'Newsletter abonnieren'
    },
    footer: {
      heading: 'Unabhängige Berichterstattung über KI in Deutschlands Industrie- und Innovationslandschaft.',
      navigate: 'Navigation',
      coverageThemes: 'Schwerpunkte',
      blurb: 'Ein kompakter Wochenbrief zu KI in deutscher Industrie, Startups, Forschung und Politik.',
      copyright: '© 2026 AIforGermany',
      themes: {
        industry: 'Industrie 5.0',
        startups: 'Deutsche KI-Startups',
        research: 'Forschungsökosystem',
        policy: 'Politik und Regulierung'
      }
    },
    newsletterCta: {
      eyebrow: 'Newsletter',
      title: 'Den wöchentlichen AIforGermany-Brief abonnieren',
      description:
        'Ein kompakter Wochenrückblick zu Bewegungen in der deutschen KI-Industrie, Startup-Dynamik, Forschungssignalen und politischen Entwicklungen.',
      button: 'Zur Newsletter-Seite'
    },
    content: {
      categories: {
        industry: 'Industrie',
        startups: 'Startups',
        research: 'Forschung',
        policy: 'Politik'
      }
    },
    pages: {
      home: {
        seo: {
          title: 'KI in Deutschland',
          description:
            'AIforGermany ist eine moderne Editorial-Plattform für KI in deutscher Industrie, Startups, Forschung, Politik und Innovation.'
        },
        hero: {
          eyebrow: 'KI in Deutschland',
          title: 'Eine klare Editorial-Plattform, um Deutschlands KI-Transformation zu verstehen.',
          description:
            'AIforGermany verfolgt, wie künstliche Intelligenz die deutsche Industrie, Startups, Forschungseinrichtungen, politische Agenden und das breitere Innovationsökosystem verändert.',
          latestCoverage: 'Neueste Beiträge lesen',
          exploreTopics: 'Themen erkunden',
          readyValue: 'Bereit',
          coverageAreas: 'Kernbereiche rund um Industrie, Startups, Forschung, Politik und Innovation.',
          scalableFoundation: 'Fundament für Reports, Verzeichnisse und datengetriebene Themenseiten vorbereitet.'
        },
        carousel: {
          slides: {
            frontier: {
              title: 'KI-Aufbruch',
              subtitle: 'Ein prägnantes Eröffnungsbild für Deutschlands nächste Phase industrieller, staatlicher und wissenschaftlicher KI.',
              alt: 'Futuristische KI-Visualisierung für Deutschlands technologischen Wandel'
            },
            industry: {
              title: 'Smarte Industrie',
              subtitle: 'KI-getriebene Fabriken, Robotik und präzise Automatisierung in Deutschlands industrieller Basis.',
              alt: 'Industrierobotik und vernetzte Produktionssysteme'
            },
            research: {
              title: 'Forschung und Innovation',
              subtitle: 'Wissenschaftliche Durchbrüche, angewandte Institute und souveräne KI-Kompetenz im Übergang in reale Systeme.',
              alt: 'Modernes Laborumfeld mit KI-Forschungskontext'
            },
            mobility: {
              title: 'Saubere Mobilität',
              subtitle: 'Autonomer Verkehr, effiziente Flotten und softwaredefinierte Mobilitätsinfrastruktur.',
              alt: 'Modernes Fahrzeug und nachhaltige Mobilitätstechnologie'
            },
            governance: {
              title: 'Digitale Governance',
              subtitle: 'Öffentliche Infrastruktur, politische Aufsicht und regelkonformer KI-Einsatz im großen Maßstab.',
              alt: 'Moderne Architektur als Sinnbild digitaler Governance'
            },
            ecosystem: {
              title: 'Nationales KI-Ökosystem',
              subtitle: 'Vernetzte Institutionen, Startups, Infrastruktur und staatliche Kapazität entlang des deutschen KI-Stacks.',
              alt: 'Visualisierung eines vernetzten KI-Ökosystems in Deutschland'
            }
          }
        },
        featured: {
          eyebrow: 'Im Fokus',
          title: 'Signale, die in Deutschlands KI-Landschaft zählen',
          description:
            'Das erste Artikel-Framework ist bereit für redaktionelle Veröffentlichung, Themenwachstum und spätere Content-Workflows.'
        },
        topics: {
          eyebrow: 'Themen',
          title: 'Aufgebaut rund um die Themen, die die deutsche KI-Debatte prägen',
          description:
            'Die Seitenstruktur unterstützt sofort redaktionelle Themen-Hubs und lässt Raum für reichhaltigere Kategorieseiten.'
        },
        editorialDirection: {
          eyebrow: 'Redaktionelle Richtung',
          title: 'Heute reduziert, morgen skalierbar.',
          bodyOne:
            'Dieses Grundgerüst unterstützt bereits Landingpage, Artikelübersicht, Artikeldetailseite, Themenübersicht, Newsletter-Bereich, Über-uns-Seite und eine 404-Erfahrung.',
          bodyTwo:
            'Die Content-Schicht ist bewusst einfach und mock-data-basiert, damit künftig CMS, Markdown-Pipeline, API oder statische Workflows eingeführt werden können, ohne die Struktur neu bauen zu müssen.'
        }
      },
      articles: {
        seo: {
          title: 'Artikel',
          description:
            'Durchsuche die AIforGermany-Berichterstattung zu Industrie, Startups, Forschung und Politik in einem klaren redaktionellen Archiv.'
        },
        intro: {
          eyebrow: 'Artikel',
          title: 'Berichte und Analysen zu KI in ganz Deutschland',
          description:
            'Diese erste Übersicht kann sich später zu einem reicheren redaktionellen Archiv mit Filtern, Pagination, Autor:innen und strukturierten Quellen entwickeln.'
        }
      },
      articleDetail: {
        missing: {
          seoTitle: 'Artikel nicht gefunden',
          seoDescription: 'Der angeforderte Artikel konnte nicht gefunden werden.',
          eyebrow: 'Fehlender Artikel',
          title: 'Dieser Artikel ist im aktuellen Mock-Content noch nicht vorhanden.'
        }
      },
      topics: {
        seo: {
          title: 'Themen',
          description:
            'Erkunde AIforGermany-Themen zu Industrie 5.0, Startups, Forschung und Politik in einer skalierbaren Übersicht.'
        },
        intro: {
          eyebrow: 'Themen',
          title: 'Redaktionelle Hubs für die Themen, die KI in Deutschland prägen',
          description:
            'Diese Themenblöcke können später zu reichhaltigeren Kategorieseiten mit Timelines, Reports, Datenkarten und gefilterten Archiven wachsen.'
        }
      },
      about: {
        seo: {
          title: 'Über uns',
          description:
            'Erfahre mehr über die redaktionelle Mission von AIforGermany und wie die Plattform KI im deutschen Ökosystem abdeckt.'
        },
        intro: {
          eyebrow: 'Über uns',
          title: 'Ein Publikationsrahmen, der KI in Deutschland verständlich macht',
          description:
            'AIforGermany ist als klare Editorial-Plattform positioniert, die zeigt, wie künstliche Intelligenz deutsche Industriestärke, Startup-Dynamik, Forschungstransfer und staatliche Handlungsfähigkeit beeinflusst.'
        },
        body: {
          one:
            'Der erste Build ist bewusst minimal und professionell. Er setzt auf starke Hierarchie, content-first Layouts und eine wartbare Angular-Struktur, die in reichhaltigere Publishing-Workflows hineinwachsen kann.',
          two:
            'Von hier aus kann das Projekt zu Longform-Reports, Startup-Verzeichnissen, regionalen Ökosystem-Seiten und datenbasierten Themen-Hubs ausgebaut werden, ohne die Kernstruktur zu ersetzen.'
        },
        principles: {
          title: 'Redaktionelle Prinzipien',
          one: 'Erklären, wie KI die deutsche Industrie verändert, nicht nur wie die Technologie theoretisch funktioniert.',
          two:
            'Forschung, Startups, öffentliche Institutionen und Unternehmensadoption zu einer kohärenten Erzählung verbinden.',
          three: 'Klarheit, Kontext und praktische Relevanz über Hype stellen.'
        }
      },
      newsletter: {
        seo: {
          title: 'Newsletter',
          description: 'Erkunde den AIforGermany-Newsletter und seinen wöchentlichen Überblick zu KI in Deutschland.'
        },
        intro: {
          eyebrow: 'Newsletter',
          title: 'Ein wöchentlicher Überblick zu KI in Deutschland',
          description:
            'Die aktuelle Seite ist bewusst einfach gehalten und bereit für einen späteren E-Mail-Anbieter oder einen eigenen Subscription-Flow.'
        },
        body: {
          one:
            'Der Newsletter kann zum redaktionellen Herzschlag der Plattform werden: ein kompakter Digest, der Leser:innen ohne Rauschen über industrielle KI-Einsätze, Startup-Dynamik, Forschungstransfer und politische Verschiebungen informiert.',
          two:
            'Das Formular unten ist vorerst nur eine Platzhalter-UI. Es ist so angelegt, dass es später gegen eine Anbieter-Integration, eine eigene API oder einen CMS-gestützten Sign-up-Workflow ausgetauscht werden kann.'
        },
        form: {
          name: 'Name',
          namePlaceholder: 'Ada Lovelace',
          email: 'E-Mail',
          emailPlaceholder: 'du@example.com',
          button: 'Die Abo-Integration kommt als Nächstes'
        },
        expectations: {
          title: 'Was Abonnent:innen erwarten können',
          one: 'Eine wöchentliche Zusammenfassung der relevantesten KI-Signale aus Deutschland.',
          two: 'Kurze Analysen zu industrieller Adoption, Startups, Forschung und Politik.',
          three: 'Ein Format für vielbeschäftigte Operator, Gründer:innen, Forschende und politische Entscheider:innen.'
        }
      },
      notFound: {
        seo: {
          title: 'Seite nicht gefunden',
          description: 'Die angeforderte Seite konnte auf AIforGermany nicht gefunden werden.'
        },
        eyebrow: '404',
        title: 'Diese Seite ist noch nicht Teil der aktuellen AIforGermany-Routen.',
        description: 'Das Routing-Fundament steht, aber diese URL verweist derzeit auf keine Seite.'
      }
    }
  }
};

export function resolveTranslation(locale: AppLocale, key: TranslationKey): string {
  const segments = key.split('.');
  let value: unknown = translations[locale];

  for (const segment of segments) {
    value = (value as Record<string, unknown>)[segment];
  }

  if (typeof value !== 'string') {
    throw new Error(`Missing translation for key "${key}" in locale "${locale}"`);
  }

  return value;
}
