// deviceId is client-generated and must stay stable for this browser — the
// server never returns one (docs/AUTH_MODULE.md §4). Shared by every
// endpoint that needs it (register/login/verify-otp/refresh/logout) and by
// baseApi's reauth wrapper, so there's a single source of truth for the key.
const DEVICE_ID_KEY = 'rhynk_device_id'

export const getDeviceId = () => {
  let deviceId = localStorage.getItem(DEVICE_ID_KEY)
  if (!deviceId) {
    deviceId = crypto.randomUUID()
    localStorage.setItem(DEVICE_ID_KEY, deviceId)
  }
  return deviceId
}
