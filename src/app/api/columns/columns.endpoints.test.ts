import { getAllColumns, getColumnById, createColumn, updateColumn, deleteColumn } from './columns.endpoints';
import { createClient } from '@/utils/supabase/client';  // Assure-toi que le bon chemin est utilisé pour l'import

jest.mock('@/utils/supabase/client'); // Mocking the supabase client

describe('Column API Endpoints', () => {
  
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

  it('should fetch all columns successfully', async () => {
    const mockData = [{ id: '1', name: 'Column 1' }];
    mockClient.select.mockResolvedValue({ data: mockData, error: null });

    const response = await getAllColumns();
    const responseBody = await response.json();  // Parse the response to get the body

    expect(response.status).toBe(200);
    expect(responseBody).toEqual(mockData);  // Now you can check the response body
  });

  it('should return 500 when fetching columns fails', async () => {
    mockClient.select.mockResolvedValue({ data: null, error: new Error('Failed to fetch') });

    const response = await getAllColumns();
    const responseBody = await response.json();  // Parse the response

    expect(response.status).toBe(500);
    expect(responseBody.error).toBe('Failed to fetch columns');
  });

  it('should return 404 if column not found', async () => {
    mockClient.select.mockResolvedValue({ data: null, error: new Error('Column not found') });
    mockClient.eq.mockReturnValue(mockClient);

    const response = await getColumnById('1');
    const responseBody = await response.json();  // Parse the response

    expect(response.status).toBe(404);
    expect(responseBody.error).toBe('Column not found');
  });

  it('should return 400 for invalid column creation data', async () => {
    const invalidColumn = {}; // Missing required fields
    const response = await createColumn(invalidColumn as any);
    const responseBody = await response.json();  // Parse the response

    expect(response.status).toBe(400);
    expect(responseBody.error).toBe('Validation failed');
  });
});
