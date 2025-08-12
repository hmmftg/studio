import ServiceRoom from "./ServiceRoom";

export async function generateStaticParams() {
  return [
    { room: 'pharmacy' },
    { room: 'lab' },
    { room: 'nursing' },
  ];
}

export default function ServiceRoomPage() {
    return <ServiceRoom />;
}
