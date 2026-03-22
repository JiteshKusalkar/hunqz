import { describe, expect, it } from 'vitest';
import { mapRawProfile } from './profile-images';

describe('mapRawProfile', () => {
  it('turns hunqz JSON into our ProfileBase shape', () => {
    const profile = mapRawProfile({
      id: '41469841',
      name: 'msescortplus',
      online_status: 'OFFLINE',
      headline: 'Hello',
      preview_pic: { id: 'a', url_token: 'token-a' },
      pictures: [{ id: 'b', url_token: 'token-b' }],
    });

    expect(profile.name).toBe('msescortplus');
    expect(profile.onlineStatus).toBe('OFFLINE');
    expect(profile.previewImage?.urlToken).toBe('token-a');
    expect(profile.images[0].urlToken).toBe('token-b');
  });
});
