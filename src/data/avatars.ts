import { UserAvatar } from "@/types";

export const baseAvatars: { id: string; name: string; icon: string }[] = [
    { id: 'avatar-01', name: 'Athlete 1', icon: '🏃' },
    { id: 'avatar-02', name: 'Athlete 2', icon: '🤸' },
    { id: 'avatar-03', name: 'Athlete 3', icon: '🤾' },
    { id: 'avatar-04', name: 'Athlete 4', icon: '🤺' },
];

export const accessories: { id: string; name: string; icon: string, type: 'head' | 'face' }[] = [
    { id: 'acc-headband', name: 'Headband', icon: '🎽', type: 'head' },
    { id: 'acc-sunglasses', name: 'Sunglasses', icon: '😎', type: 'face' },
    { id: 'acc-cap', name: 'Cap', icon: '🧢', type: 'head' },
    { id: 'acc-medal', name: 'Gold Medal', icon: '🥇', type: 'face' },
];

export const defaultAvatar: UserAvatar = {
    base: 'avatar-01',
    accessories: [],
};
