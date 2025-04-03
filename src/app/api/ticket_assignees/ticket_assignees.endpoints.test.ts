import { getAllTicketAssignees, getTicketAssigneeById, createTicketAssignee, updateTicketAssignee, deleteTicketAssignee } from './ticket_assignees.endpoints';
import { createClient } from '@/utils/supabase/client';

// Mock Supabase client
jest.mock('@/utils/supabase/client');

describe('Ticket Assignee API Endpoints', () => {

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

  it('should fetch all ticket assignees successfully', async () => {
    const mockData = [{ id: '1', ticketId: '101', userId: '1' }];
    mockClient.select.mockResolvedValue({ data: mockData, error: null });

    const response = await getAllTicketAssignees();
    const responseBody = await response.json();  // Parse the response

    expect(response.status).toBe(200);
    expect(responseBody).toEqual(mockData);
  });

  it('should return 500 when fetching ticket assignees fails', async () => {
    mockClient.select.mockResolvedValue({ data: null, error: new Error('Failed to fetch') });

    const response = await getAllTicketAssignees();
    const responseBody = await response.json();  // Parse the response

    expect(response.status).toBe(500);
    expect(responseBody.error).toBe('Failed to fetch ticket_assignees');
  });

  it('should return 404 if ticket assignee not found', async () => {
    mockClient.select.mockResolvedValue({ data: null, error: new Error('TicketAssignee not found') });
    mockClient.eq.mockReturnValue(mockClient);

    const response = await getTicketAssigneeById('1');
    const responseBody = await response.json();  // Parse the response

    expect(response.status).toBe(404);
    expect(responseBody.error).toBe('TicketAssignee not found');
  });

  it('should return 400 for invalid ticket assignee creation data', async () => {
    const invalidTicketAssignee = {}; // Missing required fields
    const response = await createTicketAssignee(invalidTicketAssignee as any);
    const responseBody = await response.json();  // Parse the response

    expect(response.status).toBe(400);
    expect(responseBody.error).toBe('Validation failed');
  });
});
