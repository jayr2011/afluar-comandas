export async function register() {
  if (!process.env.VERCEL) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
  }
}
