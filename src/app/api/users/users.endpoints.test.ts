import { createClient } from '@/utils/supabase/client';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from './users.endpoints';
import { NextResponse } from 'next/server';

// Mock Supabase client
jest.mock('@/utils/supabase/client');

describe('User API Endpoints', () => {

  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn(),
      eq: jest.fn().mockReturnThis(),
      insert: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      auth: {
        updateUser: jest.fn(),
      },
    };
    (createClient as jest.Mock).mockReturnValue(mockClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch all users successfully', async () => {
    const mockData = [{ id: '1', name: 'User 1', email: 'user1@example.com' }];
    mockClient.select.mockResolvedValue({ data: mockData, error: null });

    const response = await getAllUsers();
    const responseBody = await response.json();  // Parse the response

    expect(response.status).toBe(200);
    expect(responseBody).toEqual(mockData);
  });

  it('should return 500 when fetching users fails', async () => {
    mockClient.select.mockResolvedValue({ data: null, error: new Error('Failed to fetch') });

    const response = await getAllUsers();
    const responseBody = await response.json();  // Parse the response

    expect(response.status).toBe(500);
    expect(responseBody.error).toBe('Failed to fetch users');
  });

  it('should return 404 if user not found', async () => {
    mockClient.select.mockResolvedValue({ data: null, error: new Error('User not found') });
    mockClient.eq.mockReturnValue(mockClient);

    const response = await getUserById('1');
    const responseBody = await response.json();  // Parse the response

    expect(response.status).toBe(404);
    expect(responseBody.error).toBe('User not found');
  });

  it('should return 400 for invalid user creation data', async () => {
    const invalidUser = {}; // Missing required fields
    const response = await createUser(invalidUser as any);
    const responseBody = await response.json();  // Parse the response

    expect(response.status).toBe(400);
    expect(responseBody.error).toBe('Validation failed');
  });
});
