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
    sort: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
  };
}

export interface ContentSection extends Struct.ComponentSchema {
  collectionName: 'components_content_sections';
  info: {
    displayName: 'Section';
    icon: 'grid';
  };
  attributes: {
    buttonLabel: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
    enabled: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<true>;
    icon: Schema.Attribute.Text &
      Schema.Attribute.CustomField<'plugin::icons-field.icon'>;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    sort: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    subtitle: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
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
    sort: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
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
    displayName: 'Open Graph';
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
    ogType: Schema.Attribute.Enumeration<['website', 'article', 'profile']> &
      Schema.Attribute.DefaultTo<'website'>;
    ogUrl: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    displayName: 'SEO';
    icon: 'search';
  };
  attributes: {
    canonicalURL: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    keywords: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    metaDescription: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
        minLength: 50;
      }>;
    metaImage: Schema.Attribute.Media<'images'>;
    metaRobots: Schema.Attribute.Enumeration<
      [
        'index, follow',
        'noindex, follow',
        'index, nofollow',
        'noindex, nofollow',
      ]
    > &
      Schema.Attribute.DefaultTo<'index, follow'>;
    metaTitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    metaViewport: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }> &
      Schema.Attribute.DefaultTo<'width=device-width, initial-scale=1.0'>;
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
    displayName: 'Social Link';
    icon: 'link';
  };
  attributes: {
    description: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    icon: Schema.Attribute.Text &
      Schema.Attribute.CustomField<
        'plugin::icons-field.icon',
        {
          preset: 'icons';
        }
      >;
    openInNewTab: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<true>;
    platform: Schema.Attribute.Enumeration<
      [
        'GitHub',
        'LinkedIn',
        'Twitter',
        'YouTube',
        'Instagram',
        'Facebook',
        'TikTok',
        'Discord',
        'Twitch',
        'Mastodon',
      ]
    > &
      Schema.Attribute.Required;
    text: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    url: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
  };
}

export interface SharedStreamingLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_streaming_links';
  info: {
    displayName: 'Streaming Link';
    icon: 'headphone';
  };
  attributes: {
    isPrimary: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    platform: Schema.Attribute.Enumeration<
      ['Spotify', 'SoundCloud', 'YouTube', 'Apple Music', 'Bandcamp', 'Tidal']
    > &
      Schema.Attribute.Required;
    url: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
  };
}

export interface SharedWebLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_web_links';
  info: {
    displayName: 'Web Link';
    icon: 'hashtag';
  };
  attributes: {
    description: Schema.Attribute.Text;
    icon: Schema.Attribute.Text &
      Schema.Attribute.CustomField<'plugin::icons-field.icon'>;
    openInNewTab: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<true>;
    text: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    url: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
  };
}

export interface UiCardLink extends Struct.ComponentSchema {
  collectionName: 'components_ui_card_links';
  info: {
    displayName: 'Card Link';
    icon: 'layer';
  };
  attributes: {
    button: Schema.Attribute.Component<'ui.cta-button', false> &
      Schema.Attribute.Required;
    description: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
    icon: Schema.Attribute.Text &
      Schema.Attribute.CustomField<'plugin::icons-field.icon'>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    variant: Schema.Attribute.Enumeration<
      ['cyan-blue', 'purple-pink', 'green-teal', 'orange-red', 'indigo-violet']
    >;
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
          selection: [];
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

export interface UiLoadingStep extends Struct.ComponentSchema {
  collectionName: 'components_ui_loading_steps';
  info: {
    displayName: 'Loading Step';
    icon: 'loader';
  };
  attributes: {
    description: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    enabled: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    icon: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.CustomField<
        'plugin::icons-field.icon',
        {
          selection: [];
        }
      >;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
    stepId: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMax<
        {
          max: 20;
          min: 1;
        },
        number
      >;
    weight: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 50;
          min: 5;
        },
        number
      > &
      Schema.Attribute.DefaultTo<20>;
  };
}

export interface UiTag extends Struct.ComponentSchema {
  collectionName: 'components_ui_tags';
  info: {
    description: 'Colored tag for categorization';
    displayName: 'Tag';
    icon: 'hashtag';
  };
  attributes: {
    color: Schema.Attribute.Enumeration<
      [
        'cyan',
        'blue',
        'purple',
        'pink',
        'green',
        'teal',
        'orange',
        'red',
        'gray',
      ]
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'cyan'>;
    label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 30;
      }>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'content.achievement': ContentAchievement;
      'content.section': ContentSection;
      'content.stats': ContentStats;
      'media.audio-metadata': MediaAudioMetadata;
      'shared.open-graph': SharedOpenGraph;
      'shared.seo': SharedSeo;
      'shared.social-links': SharedSocialLinks;
      'shared.streaming-link': SharedStreamingLink;
      'shared.web-link': SharedWebLink;
      'ui.card-link': UiCardLink;
      'ui.cta-button': UiCtaButton;
      'ui.image-element': UiImageElement;
      'ui.loading-step': UiLoadingStep;
      'ui.tag': UiTag;
    }
  }
}
