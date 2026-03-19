import { getJson } from '@hunqz/shared/api';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { buildProfileImageUrl, fetchProfile, mapRawProfile } from './profile-images';
import type { RawProfileResponse } from './raw-types';

vi.mock('@hunqz/shared/api', () => ({
  getJson: vi.fn(),
}));

const getJsonMock = vi.mocked(getJson);

describe('buildProfileImageUrl', () => {
  it('builds URL from token', () => {
    expect(buildProfileImageUrl('abc123')).toBe(
      'https://www.hunqz.com/img/usr/original/0x0/abc123.jpg',
    );
  });

  it('throws when token is empty', () => {
    expect(() => buildProfileImageUrl('   ')).toThrow('urlToken is required');
  });
});

describe('mapRawProfile', () => {
  it('maps valid raw payload and filters invalid pictures', () => {
    const raw: RawProfileResponse = {
      id: '41469841',
      name: 'msescortplus',
      online_status: 'ONLINE',
      preview_pic: {
        id: 'Lve4CRM',
        url_token: '2ba5a5fbc41fea7fceb186fb44',
        width: 366,
        height: 650,
        rating: 'NEUTRAL',
        is_public: true,
      },
      pictures: [
        { id: 'img-1', url_token: 'tok-1', width: 100, height: 200, rating: 'APP_SAFE' },
        { id: 'missing-token' },
      ],
    };

    const mapped = mapRawProfile(raw);
    expect(mapped.id).toBe('41469841');
    expect(mapped.name).toBe('msescortplus');
    expect(mapped.previewImage?.imageUrl).toContain('2ba5a5fbc41fea7fceb186fb44.jpg');
    expect(mapped.images).toHaveLength(1);
    expect(mapped.images[0].imageUrl).toContain('tok-1.jpg');
  });

  it('throws on malformed required fields', () => {
    expect(() => mapRawProfile({ name: 'missing-id' })).toThrow('Invalid profile.id');
  });
});

describe('fetchProfile', () => {
  beforeEach(() => {
    getJsonMock.mockReset();
  });

  it('fetches and maps profile data', async () => {
    getJsonMock.mockResolvedValue({
      id: '41469841',
      name: 'msescortplus',
      pictures: [{ id: 'p1', url_token: 'token-1' }],
    } as RawProfileResponse);

    const result = await fetchProfile();

    expect(getJsonMock).toHaveBeenCalledTimes(1);
    expect(getJsonMock.mock.calls[0][0]).toBe('/api/opengrid/profiles/msescortplus');
    expect(result.images).toHaveLength(1);
    expect(result.images[0].imageUrl).toContain('token-1.jpg');
  });

  it('propagates upstream transport errors', async () => {
    getJsonMock.mockRejectedValue(new Error('network down'));
    await expect(fetchProfile()).rejects.toThrow('network down');
  });
});
