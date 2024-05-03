//@ts-nocheck
import ExistentConceptMapGet from '../../src/service/existentConceptMapGet';
import { Request } from 'express';
import DiagramStorage from '../src/repo/diagramStorage';
import DiagramDb from '../src/repo/diagramDb';
import DiskStorage from '../src/repo/diskStorage';

describe('ExistentConceptMapGet', () => {
    let existentConceptMapGet: ExistentConceptMapGet;
    const mockRequest: Request = {} as Request;

    beforeEach(() => {
        existentConceptMapGet = new ExistentConceptMapGet(123, mockRequest);
    });

    afterEach(() => {
    });

    it('should initialize correctly', () => {
        expect(existentConceptMapGet).toBeInstanceOf(ExistentConceptMapGet);
        expect(existentConceptMapGet['articleId']).toBe(123);
        expect(existentConceptMapGet['req']).toBe(mockRequest);
        expect(existentConceptMapGet['diagramDb']).toBeInstanceOf(DiagramDb);
        expect(existentConceptMapGet['diagramStorage']).toBeInstanceOf(DiagramStorage);
    });

    it('should get concept map UUID from database', async () => {
        jest.spyOn(existentConceptMapGet['diagramDb'], 'getDiagramByArticleId').mockResolvedValueOnce({ StorageDiagramUUID: 'mockUUID' });
        const diagramUUID = await existentConceptMapGet['getConceptMapUUIDFromDb']();
        expect(diagramUUID).toBe('mockUUID');
    });

    it('should get concept map from storage', async () => {
        const mockDiagramUUID = 'mockUUID';
        jest.spyOn(existentConceptMapGet['diagramStorage'], 'getDiagram').mockResolvedValueOnce(new ReadableStream());
        const diagramStream = await existentConceptMapGet['getConceptMapFromStorage'](mockDiagramUUID);
        expect(diagramStream).toBeInstanceOf(ReadableStream);
    });

    it('should save diagram to disk', async () => {
        const mockDiagramUUID = 'mockUUID';
        const mockDiagramStream = new ReadableStream();
        jest.spyOn(DiskStorage, 'saveReadableStreamToDisk').mockResolvedValueOnce('mockFilePath');
        const filePath = await existentConceptMapGet['saveDiagramToDisk'](mockDiagramUUID, mockDiagramStream);
        expect(filePath).toBe('mockFilePath');
    });

    it('should handle the get request', async () => {
        const mockDiagramUUID = 'mockUUID';
        const mockDiagramStream = new ReadableStream();
        jest.spyOn(existentConceptMapGet, 'getConceptMapUUIDFromDb').mockResolvedValueOnce(mockDiagramUUID);
        jest.spyOn(existentConceptMapGet, 'getConceptMapFromStorage').mockResolvedValueOnce(mockDiagramStream);
        jest.spyOn(existentConceptMapGet, 'saveDiagramToDisk').mockResolvedValueOnce('mockFilePath');

        await expect(existentConceptMapGet.get()).resolves.toBe('mockFilePath');
    });
});
