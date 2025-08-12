import ServiceRoom from "./ServiceRoom";

export async function generateStaticParams() {
  return [
    { room: 'lab' },
  ];
}

export default function ServiceRoomPage() {
    return (
        <ServiceRoom />
    );
}
