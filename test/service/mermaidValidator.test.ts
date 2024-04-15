import MermaidValidator from '../../src/service/mermaidValidator.js';

describe('MermaidValidator', () => {
    const VALIDATE_TIMEOUT = 10000;
    describe('validate', () => {
        it('should return true if the mermaid code is valid', async () => {
            // Arrange
            const validMermaidCode = 'graph LR\nA-->B';

            // Act
            const validator = new MermaidValidator(validMermaidCode);
            const isValid = await validator.validate();

            // Assert
            expect(isValid).toBe(true);
        }, VALIDATE_TIMEOUT);

        it('should return false if the mermaid code is invalid', async () => {
            // Arrange
            const invalidMermaidCode = 'graph LR\nA---B';

            // Act
            const validator = new MermaidValidator(invalidMermaidCode);
            const isValid = await validator.validate();

            // Assert
            expect(isValid).toBe(false);
        }, VALIDATE_TIMEOUT);
    });
});
