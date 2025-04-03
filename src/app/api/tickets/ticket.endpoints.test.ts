import { getAllTickets, getTicketById, createTicket, updateTicket, deleteTicket } from './ticket.endpoints';
import { createClient } from '@/utils/supabase/client';

// Mock Supabase client
jest.mock('@/utils/supabase/client');

describe('Ticket API Endpoints', () => {

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

  it('should fetch all tickets successfully', async () => {
    const mockData = [{ id: '1', title: 'Ticket 1' }];
    mockClient.select.mockResolvedValue({ data: mockData, error: null });

    const response = await getAllTickets();
    const responseBody = await response.json();  // Parse the response

    expect(response.status).toBe(200);
    expect(responseBody).toEqual(mockData);
  });

  it('should return 500 when fetching tickets fails', async () => {
    mockClient.select.mockResolvedValue({ data: null, error: new Error('Failed to fetch') });

    const response = await getAllTickets();
    const responseBody = await response.json();  // Parse the response

    expect(response.status).toBe(500);
    expect(responseBody.error).toBe('Failed to fetch tickets');
  });

  it('should return 404 if ticket not found', async () => {
    mockClient.select.mockResolvedValue({ data: null, error: new Error('Ticket not found') });
    mockClient.eq.mockReturnValue(mockClient);

    const response = await getTicketById('1');
    const responseBody = await response.json();  // Parse the response

    expect(response.status).toBe(404);
    expect(responseBody.error).toBe('Ticket not found');
  });


  it('should return 400 for invalid ticket creation data', async () => {
    const invalidTicket = {}; // Missing required fields
    const response = await createTicket(invalidTicket as any);
    const responseBody = await response.json();  // Parse the response

    expect(response.status).toBe(400);
    expect(responseBody.error).toBe('Validation failed');
  });
});
