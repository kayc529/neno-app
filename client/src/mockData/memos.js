export const mockGetAllMemosResponse = {
  success: true,
  memos: [
    {
      id: 1,
      title: 'My first memo',
      content: 'This is my first memo!',
      image: null,
      tags: 'first+memo+happy',
      isPinned: true,
      isArchived: false,
      createdAt: null,
      modifiedAt: null,
    },
    {
      id: 2,
      title: 'My Second memo',
      content: 'This is my second memo!',
      image: null,
      tags: 'second+memo+happy',
      isPinned: false,
      isArchived: false,
      createdAt: null,
      modifiedAt: null,
    },
    {
      id: 3,
      title: 'My Third memo',
      content: 'This is my third memo!',
      image: null,
      tags: 'third+memo+happy',
      isPinned: false,
      isArchived: false,
      createdAt: null,
      modifiedAt: null,
    },
  ],
  count: 1,
};

export const mockGetMemoResponse = [
  {
    success: true,
    memo: {
      id: 1,
      title: 'My first memo',
      content: 'This is my first memo',
      image: null,
      tags: 'first+memo+happy',
      isPinned: true,
      isArchived: false,
      createdAt: null,
      modifiedAt: null,
    },
  },
  {
    success: true,
    memo: {
      id: 2,
      title: 'My Second memo',
      content: 'This is my second memo!',
      image: null,
      tags: 'second+memo+happy',
      isPinned: false,
      isArchived: false,
      createdAt: null,
      modifiedAt: null,
    },
  },
  {
    success: true,
    memo: {
      id: 3,
      title: 'My Third memo',
      content: 'This is my third memo!',
      image: null,
      tags: 'third+memo+happy',
      isPinned: false,
      isArchived: false,
      createdAt: null,
      modifiedAt: null,
    },
  },
];

export const mockUpdateMemoResponse = {
  success: true,
};
