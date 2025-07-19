import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/about')({
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 neon-text">About S & R Sports</h1>
      <div className="prose dark:prose-invert neon-text">
        <p className="mb-6">
          S & R Sports is a premier sports card breaking company dedicated to bringing the excitement
          of card collecting to enthusiasts worldwide. Founded by passionate collectors, we understand
          the thrill of discovering rare cards and building valuable collections.
        </p>
        <p className="mb-6">
          Our mission is to provide transparent, fair, and exciting breaking experiences while
          leveraging cutting-edge analytics to help our customers make informed decisions about
          their collections.
        </p>
        <h2 className="text-2xl font-bold mb-4 neon-text">Our Values</h2>
        <ul className="list-disc pl-6 mb-6">
          <li>Transparency in all our breaks</li>
          <li>Fair pricing and equal opportunities</li>
          <li>Community-focused approach</li>
          <li>Data-driven decision making</li>
        </ul>
      </div>
    </div>
  );
}