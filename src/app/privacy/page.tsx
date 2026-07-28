import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/data/site";

export const metadata = {
  title: "Privacy Policy",
  description: "Atlas Software privacy policy.",
};

export default function PrivacyPage() {
  return (
    <main className="privacy-page">
      <Container>
        <article>
          <Link href="/" className="atlas-button atlas-button--secondary">
            <ArrowLeft aria-hidden="true" /> Back to home
          </Link>

          <span className="atlas-label" style={{ marginTop: 64 }}>Legal / Privacy</span>
          <h1>Privacy policy</h1>
          <p>
            This page is a launch-ready structure for Atlas Software’s final privacy
            policy. It should be reviewed and completed for the specific analytics,
            contact forms, hosting services, and data-processing tools used on the
            live website.
          </p>

          <h2>Information we receive</h2>
          <p>
            Atlas Software may receive information that you choose to provide when
            contacting us, such as your name, business details, email address, phone
            number, and information about a potential project.
          </p>

          <h2>How information is used</h2>
          <p>
            Enquiry information is used to respond to messages, understand project
            requirements, prepare proposals, and manage business communication. We do
            not sell personal information.
          </p>

          <h2>Website data</h2>
          <p>
            The live website may use essential cookies, hosting logs, and privacy-aware
            analytics. This section must be updated to name the services that are
            enabled at launch.
          </p>

          <h2>Contact</h2>
          <p>
            Privacy-related questions can be sent to {" "}
            <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>.
          </p>
        </article>
      </Container>
    </main>
  );
}
