import { Container } from '@/components/Container'

const PrivacyPolicy = () => {
  return (
    <Container className="mt-9">
      <h1 className="mb-6 text-center text-2xl font-bold">Privacy Policy</h1>

      <section className="mb-6">
        <h2 className="mb-3 text-xl font-semibold">Information We Collect</h2>
        <p>
          Outline the types of data you collect:
          <ul>
            <li>Technical data (IP address, browser, etc.)</li>
            <li>Usage data (pages visited, etc.)</li>
            <li>**Add any other data collection if applicable**</li>
          </ul>
        </p>
      </section>

      <section className="mb-6">
        <h2 className="mb-3 text-xl font-semibold">
          How We Use Your Information
        </h2>
        <p>
          Explain how the collected data is used (improve website, basic
          analytics, etc.)
        </p>
      </section>

      <section className="mb-6">
        <h2 className="mb-3 text-xl font-semibold">Third-Party Sharing</h2>
        <p>
          Specify if you share any data with third parties (advertising
          partners, analytics providers, etc.). If you don't, state that
          clearly.
        </p>
      </section>

      {/* Add more sections as needed: */}
      {/* <section>... User Choices & Rights ...</section> */}
      {/* <section>... Security Measures ...</section> */}
      {/* <section>... Children's Privacy (if applicable) ...</section> */}
      {/* <section>... Policy Updates ...</section> */}
      {/* <section>... Contact Information ...</section> */}
    </Container>
  )
}

export default PrivacyPolicy
