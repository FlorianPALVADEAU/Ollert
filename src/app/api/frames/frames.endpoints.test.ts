import { getAllFrames, getFrameById, createFrame, updateFrame, deleteFrame } from './frames.endpoints';
import { createClient } from '@/utils/supabase/client';

jest.mock('@/utils/supabase/client'); // Mocking the supabase client

describe('Frame API Endpoints', () => {
  
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn(),
      eq: jest.fn().mockReturnThis(),
      insert: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    (createClient as jest.Mock).mockReturnValue(mockClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch all frames successfully', async () => {
    const mockData = [{ id: '1', name: 'Frame 1' }];
    mockClient.select.mockResolvedValue({ data: mockData, error: null });

    const response = await getAllFrames();
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody).toEqual(mockData);
  });

  it('should return 500 when fetching frames fails', async () => {
    mockClient.select.mockResolvedValue({ data: null, error: new Error('Failed to fetch') });

    const response = await getAllFrames();
    const responseBody = await response.json();

    expect(response.status).toBe(500);
    expect(responseBody.error).toBe('Failed to fetch frames');
  });

  it('should create a frame successfully', async () => {
    const mockFrame = {
      name: 'New Frame',
      description: 'A new frame',
      columns: [],
      collaborators: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      thumbnail: undefined,
      backgroundImage: undefined,
    };
    mockClient.insert.mockResolvedValue({ data: [mockFrame], error: null });

    const response = await createFrame(mockFrame);
    const responseBody = await response.json();

    expect(response.status).toBe(201);
    expect(responseBody).toEqual([mockFrame]);
  });

  it('should return 400 for invalid frame creation data', async () => {
    const invalidFrame = {}; // Missing required fields
    const response = await createFrame(invalidFrame as any);
    const responseBody = await response.json();

    expect(response.status).toBe(400);
    expect(responseBody.error).toBe('Validation failed');
  });

});
