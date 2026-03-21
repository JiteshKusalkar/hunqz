import { describe, expect, it } from 'vitest';
import { mapRawProfile } from './profile-images';
import type { RawProfileResponse } from './raw-types';

describe('mapRawProfile', () => {
  it('maps a valid raw payload to ProfileBase', () => {
    const raw: RawProfileResponse = {
      id: '41469841',
      name: 'msescortplus',
      online_status: 'ONLINE',
      headline: 'Test headline',
      preview_pic: {
        id: 'Lve4CRM',
        url_token: '2ba5a5fbc41fea7fceb186fb44',
        width: 366,
        height: 650,
        rating: 'NEUTRAL',
        is_public: true,
      },
      pictures: [
        {
          id: 'img-1',
          url_token: 'tok-1',
          width: 100,
          height: 200,
          rating: 'APP_SAFE',
          is_public: true,
        },
        {
          id: 'img-2',
          url_token: 'tok-2',
          width: 50,
          height: 50,
          rating: 'EROTIC',
          is_public: false,
        },
      ],
    };

    const profile = mapRawProfile(raw);

    expect(profile.id).toBe('41469841');
    expect(profile.name).toBe('msescortplus');
    expect(profile.onlineStatus).toBe('ONLINE');
    expect(profile.headline).toBe('Test headline');

    expect(profile.previewImage).not.toBeNull();
    expect(profile.previewImage?.id).toBe('Lve4CRM');
    expect(profile.previewImage?.urlToken).toBe('2ba5a5fbc41fea7fceb186fb44');
    expect(profile.previewImage?.width).toBe(366);
    expect(profile.previewImage?.height).toBe(650);
    expect(profile.previewImage?.rating).toBe('NEUTRAL');
    expect(profile.previewImage?.isPublic).toBe(true);

    expect(profile.images).toHaveLength(2);
    expect(profile.images[0].urlToken).toBe('tok-1');
    expect(profile.images[1].urlToken).toBe('tok-2');
  });

  it('filters out pictures missing id or url_token', () => {
    const raw: RawProfileResponse = {
      id: '1',
      name: 'user',
      pictures: [
        { id: 'valid-id', url_token: 'valid-token' },
        { id: 'no-token' },
        { url_token: 'no-id' },
        {},
        null,
      ],
    };

    const profile = mapRawProfile(raw);
    expect(profile.images).toHaveLength(1);
    expect(profile.images[0].urlToken).toBe('valid-token');
  });

  it('sets previewImage to null when preview_pic is null', () => {
    const raw: RawProfileResponse = {
      id: '1',
      name: 'user',
      preview_pic: null,
      pictures: [],
    };

    expect(mapRawProfile(raw).previewImage).toBeNull();
  });

  it('sets onlineStatus and headline to null when absent', () => {
    const raw: RawProfileResponse = { id: '1', name: 'user' };
    const profile = mapRawProfile(raw);
    expect(profile.onlineStatus).toBeNull();
    expect(profile.headline).toBeNull();
  });

  it('maps numeric and boolean picture fields correctly', () => {
    const raw: RawProfileResponse = {
      id: '1',
      name: 'user',
      pictures: [
        {
          id: 'p1',
          url_token: 'tok',
          width: 300,
          height: 400,
          rating: 'APP_SAFE',
          is_public: false,
        },
      ],
    };

    const img = mapRawProfile(raw).images[0];
    expect(img.width).toBe(300);
    expect(img.height).toBe(400);
    expect(img.rating).toBe('APP_SAFE');
    expect(img.isPublic).toBe(false);
  });

  it('sets numeric fields to null when not finite numbers', () => {
    const raw: RawProfileResponse = {
      id: '1',
      name: 'user',
      pictures: [{ id: 'p1', url_token: 'tok', width: 'bad', height: NaN }],
    };

    const img = mapRawProfile(raw).images[0];
    expect(img.width).toBeNull();
    expect(img.height).toBeNull();
  });

  it('throws when profile id is missing', () => {
    expect(() => mapRawProfile({ name: 'user' })).toThrow('Invalid profile.id');
  });

  it('throws when profile name is missing', () => {
    expect(() => mapRawProfile({ id: '1' })).toThrow('Invalid profile.name');
  });

  it('does NOT set imageUrl — that is the API server responsibility', () => {
    const raw: RawProfileResponse = {
      id: '1',
      name: 'user',
      pictures: [{ id: 'p1', url_token: 'tok-1' }],
      preview_pic: { id: 'pv', url_token: 'tok-pv' },
    };

    const profile = mapRawProfile(raw);
    expect('imageUrl' in profile.images[0]).toBe(false);
    expect('imageUrl' in (profile.previewImage ?? {})).toBe(false);
  });
});
