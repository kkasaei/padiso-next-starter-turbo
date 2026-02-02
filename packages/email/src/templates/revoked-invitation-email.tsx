import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Text
} from '@react-email/components';
import { Tailwind } from '@react-email/tailwind';

export type RevokedInvitationEmailProps = {
  appName: string;
  organizationName: string;
};

export function RevokedInvitationEmail({
  appName,
  organizationName
}: RevokedInvitationEmailProps): React.JSX.Element {
  return (
    <Html>
      <Head />
      <Preview>
        Your invitation to {organizationName} has been revoked
      </Preview>
      <Tailwind>
        <Body className="m-auto bg-white px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded-sm border border-solid border-[#eaeaea] p-[20px]">
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              Invitation Revoked
            </Heading>
            <Text className="text-[14px] leading-[24px] text-black">
              Hello,
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              Your invitation to join <strong>{organizationName}</strong> on{' '}
              <strong>{appName}</strong> has been revoked by an administrator.
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              If you believe this was done in error, please contact the
              organization administrator directly.
            </Text>
            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
            <Text className="text-[12px] leading-[24px] text-[#666666]">
              This is an automated notification from {appName}. No further action
              is required.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

