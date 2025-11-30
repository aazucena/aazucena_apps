import type { Schema, Struct } from '@strapi/strapi';

export interface ContentAchievement extends Struct.ComponentSchema {
  collectionName: 'components_content_achievements';
  info: {
    displayName: 'Achievement';
    icon: 'crown';
  };
  attributes: {
    badge: Schema.Attribute.Media<'images'>;
    date: Schema.Attribute.Date;
    description: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 300;
      }>;
    icon: Schema.Attribute.Text &
      Schema.Attribute.CustomField<'plugin::icons-field.icon'>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
  };
}

export interface ContentEducation extends Struct.ComponentSchema {
  collectionName: 'components_content_educations';
  info: {
    displayName: 'Education';
    icon: 'pencil';
  };
  attributes: {
    current: Schema.Attribute.Boolean & Schema.Attribute.Required;
    degree: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    description: Schema.Attribute.RichText &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 1000;
      }>;
    field: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 150;
      }>;
    gpa: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          max: 5;
          min: 0;
        },
        number
      >;
    graduationDate: Schema.Attribute.Date;
    honors: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    institution: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    location: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    startDate: Schema.Attribute.Date & Schema.Attribute.Required;
    type: Schema.Attribute.Enumeration<
      ['diploma', 'bachelor', 'master', 'doctorates', 'certificate']
    > &
      Schema.Attribute.Required;
  };
}

export interface ContentStats extends Struct.ComponentSchema {
  collectionName: 'components_content_stats';
  info: {
    displayName: 'Stats';
    icon: 'chartCircle';
  };
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    icon: Schema.Attribute.Text &
      Schema.Attribute.CustomField<'plugin::icons-field.icon'>;
    label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
    sort: Schema.Attribute.Integer;
    value: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 20;
      }>;
  };
}

export interface MediaAudioMetadata extends Struct.ComponentSchema {
  collectionName: 'components_media_audio_metadata';
  info: {
    displayName: 'Audio Metadata';
    icon: 'music';
  };
  attributes: {
    bpm: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 300;
          min: 20;
        },
        number
      >;
    duration: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    instrumental: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    musicalKey: Schema.Attribute.Enumeration<
      [
        'C',
        'C#/D\u266D',
        'D',
        'D#/E\u266D',
        'E',
        'F',
        'F#/G\u266D',
        'G',
        'G#/A\u266D',
        'A',
        'A#/B\u266D',
        'B',
      ]
    >;
    scale: Schema.Attribute.Enumeration<
      [
        'major',
        'minor',
        'dorian',
        'phrygian',
        'lydian',
        'mixolydian',
        'aeolian',
        'locrian',
        'pentatonic_major',
        'pentatonic_minor',
        'blues',
        'harmonic_minor',
        'melodic_minor',
      ]
    >;
    timeSignature: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 10;
      }> &
      Schema.Attribute.DefaultTo<'4/4'>;
    waveformData: Schema.Attribute.JSON;
  };
}

export interface SharedOpenGraph extends Struct.ComponentSchema {
  collectionName: 'components_shared_open_graphs';
  info: {
    displayName: 'openGraph';
    icon: 'project-diagram';
  };
  attributes: {
    ogDescription: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    ogImage: Schema.Attribute.Media<'images'>;
    ogTitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 70;
      }>;
    ogType: Schema.Attribute.String;
    ogUrl: Schema.Attribute.String;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    displayName: 'seo';
    icon: 'search';
  };
  attributes: {
    canonicalURL: Schema.Attribute.String;
    keywords: Schema.Attribute.Text;
    metaDescription: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
        minLength: 50;
      }>;
    metaImage: Schema.Attribute.Media<'images'>;
    metaRobots: Schema.Attribute.String;
    metaTitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    metaViewport: Schema.Attribute.String;
    openGraph: Schema.Attribute.Component<'shared.open-graph', false>;
    structuredData: Schema.Attribute.JSON;
    twitterCard: Schema.Attribute.Enumeration<
      ['summary', 'summary_large_image', 'app', 'player']
    > &
      Schema.Attribute.DefaultTo<'summary_large_image'>;
  };
}

export interface SharedSocialLinks extends Struct.ComponentSchema {
  collectionName: 'components_shared_social_links';
  info: {
    displayName: 'Social Links';
    icon: 'link';
  };
  attributes: {
    email: Schema.Attribute.Email;
    github: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
    linkedin: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
    twitter: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
    youtube: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
  };
}

export interface UiCtaButton extends Struct.ComponentSchema {
  collectionName: 'components_ui_cta_buttons';
  info: {
    displayName: 'CTA Button';
    icon: 'cursor';
  };
  attributes: {
    icon: Schema.Attribute.Text &
      Schema.Attribute.CustomField<
        'plugin::icons-field.icon',
        {
          selection: [''];
        }
      >;
    label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
    openInNewTab: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    size: Schema.Attribute.Enumeration<['sm', 'md', 'lg']> &
      Schema.Attribute.DefaultTo<'md'>;
    url: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
    variant: Schema.Attribute.Enumeration<
      ['primary', 'secondary', 'outline', 'ghost']
    > &
      Schema.Attribute.DefaultTo<'primary'>;
  };
}

export interface UiImageElement extends Struct.ComponentSchema {
  collectionName: 'components_ui_image_elements';
  info: {
    displayName: 'Image Element';
    icon: 'picture';
  };
  attributes: {
    altText: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 150;
      }>;
    src: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'content.achievement': ContentAchievement;
      'content.education': ContentEducation;
      'content.stats': ContentStats;
      'media.audio-metadata': MediaAudioMetadata;
      'shared.open-graph': SharedOpenGraph;
      'shared.seo': SharedSeo;
      'shared.social-links': SharedSocialLinks;
      'ui.cta-button': UiCtaButton;
      'ui.image-element': UiImageElement;
    }
  }
}
